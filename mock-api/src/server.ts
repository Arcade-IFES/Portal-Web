import Fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyStatic from '@fastify/static'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

type Estado = 'submetido' | 'aprovado' | 'reprovado' | 'substituida'

type Versao = {
  id: string
  jogo_id: string
  versao: string
  estado: Estado
  submetido_em: string
  decidido_em?: string
  decidido_por?: string
  justificativa?: string
  repositorio_url?: string
  preview_url?: string
}

type Feedback = {
  partida_id: string
  jogo_id: string
  jogador: string
  nota: number
  comentario?: string
  criado_em: string
}

type Placar = {
  id_partida: string
  jogo_id: string
  versao_id?: string
  jogador: string
  pontos: number
  duracao_s?: number
  acertos?: number
  erros?: number
  tema?: string
  jogado_em: string
}

type Jogo = {
  id: string
  nome: string
  descricao: string
  resumo: string
  classico_referencia: string
  mecanica: string
  tema: string
  nivel: string
  autores: string[]
  controles: string
  versao: string
  status: Estado
  capa?: string
  tamanho_bytes?: number
  sha256?: string
  repositorio_url: string
  preview_url?: string
  versoes: Versao[]
  feedbacks: Feedback[]
  taxa_acerto_tema: {
    tema: string
    acertos: number
    erros: number
    taxa: number
  }[]
}

type Banco = {
  jogos: Jogo[]
  placares: Placar[]
  feedbacks: Feedback[]
  decisoes: {
    id: string
    versao_id: string
    decisao: Estado
    justificativa: string
    curador: string
    quando: string
  }[]
  anonimizações: {
    anterior: string
    novo: string
    quando: string
  }[]
}

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const dataFile = process.env.DATA_FILE || path.join(root, 'data', 'db.json')
const publicDir = path.join(root, 'public')
const webDist = path.resolve(root, '..', 'web', 'dist')
const app = Fastify({ logger: true })

const now = () => new Date().toISOString()

async function readDb(): Promise<Banco> {
  return JSON.parse(await fs.readFile(dataFile, 'utf8')) as Banco
}

async function writeDb(db: Banco) {
  const tmp = `${dataFile}.tmp`

  await fs.mkdir(path.dirname(dataFile), { recursive: true })
  await fs.writeFile(tmp, JSON.stringify(db, null, 2))
  await fs.rename(tmp, dataFile)
}

function average(values: number[]) {
  return values.length
    ? values.reduce((a, b) => a + b, 0) / values.length
    : 0
}

function validGithubUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false

  try {
    const url = new URL(value)

    return (
      url.protocol === 'https:' &&
      ['github.com', 'www.github.com'].includes(url.hostname) &&
      url.pathname.split('/').filter(Boolean).length >= 2
    )
  } catch {
    return false
  }
}

function partidasDoJogo(db: Banco, id: string) {
  return db.placares.filter((score) => score.jogo_id === id)
}

function publicGame(db: Banco, game: Jogo) {
  const votes = db.feedbacks.filter((vote) => vote.jogo_id === game.id)
  const partidas = partidasDoJogo(db, game.id)

  return {
    id: game.id,
    nome: game.nome,
    descricao: game.descricao,
    resumo: game.resumo,
    classico_referencia: game.classico_referencia,
    mecanica: game.mecanica,
    tema: game.tema,
    nivel: game.nivel,
    autores: game.autores,
    controles: game.controles,
    versao: game.versao,
    status: game.status,
    capa: game.capa,
    tamanho_bytes: game.tamanho_bytes,
    sha256: game.sha256,
    nota_media: Number(average(votes.map((vote) => vote.nota)).toFixed(2)),
    votos: votes.length,
    jogadores_distintos: new Set(partidas.map((partida) => partida.jogador)).size,
    partidas_jogadas: partidas.length,
    repositorio_url: game.repositorio_url,
    preview_url: game.preview_url,
    versoes: game.versoes,
    versao_id:
      game.versoes.find((version) => version.estado === game.status)?.id ??
      game.versoes[0]?.id,
    current_version_id:
      game.versoes.find((version) => version.estado === 'aprovado')?.id ??
      game.versoes[0]?.id,
  }
}

function rankingJogadores(db: Banco, jogoId: string) {
  const scores = db.placares.filter((score) => score.jogo_id === jogoId)
  const best = new Map<string, Placar>()
  const counts = new Map<string, number>()

  for (const score of scores) {
    if (score.jogador === 'ANON') continue

    counts.set(score.jogador, (counts.get(score.jogador) ?? 0) + 1)

    const current = best.get(score.jogador)
    if (
      !current ||
      score.pontos > current.pontos ||
      (score.pontos === current.pontos &&
        score.jogado_em.localeCompare(current.jogado_em) < 0)
    ) {
      best.set(score.jogador, score)
    }
  }

  return [...best.values()]
    .sort(
      (a, b) =>
        b.pontos - a.pontos ||
        a.jogado_em.localeCompare(b.jogado_em),
    )
    .map((score, index) => ({
      posicao: index + 1,
      apelido: score.jogador,
      pontos: score.pontos,
      jogo_id: score.jogo_id,
      jogo:
        db.jogos.find((game) => game.id === score.jogo_id)?.nome ??
        score.jogo_id,
      acertos: score.acertos ?? 0,
      erros: score.erros ?? 0,
      duracao_s: score.duracao_s,
      jogado_em: score.jogado_em,
      partidas: counts.get(score.jogador) ?? 0,
    }))
}

function rankingJogos(db: Banco) {
  const approved = db.jogos.filter((game) => game.status === 'aprovado')
  const global = average(db.feedbacks.map((vote) => vote.nota)) || 3
  const m = 5

  return approved
    .map((game) => {
      const votes = db.feedbacks.filter((vote) => vote.jogo_id === game.id)
      const partidas = partidasDoJogo(db, game.id)
      const nota = average(votes.map((vote) => vote.nota))
      const jogadores = new Set(partidas.map((partida) => partida.jogador)).size
      const ajustada = votes.length
        ? (votes.length / (votes.length + m)) * nota +
          (m / (votes.length + m)) * global
        : global

      return {
        jogo_id: game.id,
        jogo: game.nome,
        nota: Number(nota.toFixed(2)),
        votos: votes.length,
        partidas: partidas.length,
        jogadores_distintos: jogadores,
        nota_ajustada: Number(ajustada.toFixed(2)),
      }
    })
    .sort(
      (a, b) =>
        b.nota_ajustada - a.nota_ajustada ||
        b.jogadores_distintos - a.jogadores_distintos ||
        b.partidas - a.partidas,
    )
    .map((item, index) => ({
      posicao: index + 1,
      ...item,
    }))
}

await app.register(cors, { origin: true })

const health = async () => ({
  ok: true,
  service: 'recreio-arcade-g2-mock-api',
  mode: 'mock-g1-integration',
})

app.get('/health', health)
app.get('/api/health', health)

app.get('/api/jogos', async (req) => {
  const db = await readDb()
  const query = req.query as { status?: string }

  return db.jogos
    .filter((game) => (query.status ? game.status === query.status : true))
    .map((game) => publicGame(db, game))
})

app.get('/api/jogos/:id', async (req, reply) => {
  const db = await readDb()
  const { id } = req.params as { id: string }
  const game = db.jogos.find((item) => item.id === id)

  if (!game) {
    return reply.code(404).send({ erro: 'Jogo não encontrado.' })
  }

  const partidas = partidasDoJogo(db, id)
  const themes = new Map<string, { acertos: number; erros: number }>()

  for (const partida of partidas) {
    const tema = partida.tema || game.tema
    const item = themes.get(tema) ?? { acertos: 0, erros: 0 }

    item.acertos += partida.acertos ?? 0
    item.erros += partida.erros ?? 0
    themes.set(tema, item)
  }

  return {
    ...publicGame(db, game),
    feedbacks: db.feedbacks
      .filter((feedback) => feedback.jogo_id === id)
      .map((feedback) => ({
        partida_id: feedback.partida_id,
        apelido: feedback.jogador,
        nota: feedback.nota,
        comentario: feedback.comentario,
        criado_em: feedback.criado_em,
      })),
    taxa_acerto_tema: [...themes.entries()].map(([tema, values]) => ({
      tema,
      acertos: values.acertos,
      erros: values.erros,
      taxa:
        values.acertos + values.erros
          ? (values.acertos / (values.acertos + values.erros)) * 100
          : 0,
    })),
  }
})

// O mock reproduz o contrato atual do G1 para desenvolvimento local.
// Ele não baixa o GitHub nem valida game.json; essa responsabilidade continua no G1.
app.post('/api/jogos', async (req, reply) => {
  const body = req.body as {
    repositorio_url?: string
    ref?: string
    resumo?: string
  }

  if (!validGithubUrl(body.repositorio_url)) {
    return reply.code(422).send({
      codigo: 'REPOSITORIO_INVALIDO',
      erro: 'Informe uma URL HTTPS válida de um repositório GitHub.',
    })
  }

  if (!body.ref?.trim()) {
    return reply.code(400).send({
      codigo: 'REQUISICAO_INVALIDA',
      erro: 'Informe a tag/ref da versão.',
    })
  }

  const db = await readDb()
  const id = `jogo-${Date.now()}`
  const versionId = `versao-${Date.now()}`
  const submittedAt = now()
  const ref = body.ref.trim()

  const version: Versao = {
    id: versionId,
    jogo_id: id,
    versao: ref.replace(/^v/, '') || ref,
    estado: 'submetido',
    submetido_em: submittedAt,
    repositorio_url: body.repositorio_url,
  }

  const game: Jogo = {
    id,
    nome: `Jogo enviado (${ref})`,
    descricao: 'Dados simulados pelo Mock API local.',
    resumo: body.resumo?.trim() || 'Submissão de teste do Portal G2.',
    classico_referencia: 'A informar pelo manifesto',
    mecanica: 'A informar pelo manifesto',
    tema: 'A informar pelo manifesto',
    nivel: 'A informar pelo manifesto',
    autores: ['Autor do mock'],
    controles: 'A informar pelo manifesto',
    versao: version.versao,
    status: 'submetido',
    repositorio_url: body.repositorio_url,
    preview_url: undefined,
    versoes: [version],
    feedbacks: [],
    taxa_acerto_tema: [],
  }

  db.jogos.push(game)
  await writeDb(db)

  return reply.code(201).send(publicGame(db, game))
})

function getBearerToken(req: { headers: { authorization?: string } }) {
  const authorization = req.headers.authorization

  if (!authorization?.startsWith('Bearer ')) {
    return ''
  }

  return authorization.slice('Bearer '.length).trim()
}

function requireMockCurator(
  req: { headers: { authorization?: string } },
  reply: { code: (status: number) => { send: (payload: unknown) => unknown } },
) {
  const token = getBearerToken(req)

  if (!token) {
    reply.code(401).send({
      codigo: 'NAO_AUTENTICADO',
      erro: 'Informe o token de curador.',
    })
    return false
  }

  if (token !== 'dev-curador') {
    reply.code(401).send({
      codigo: 'TOKEN_INVALIDO',
      erro: 'Token de curador inválido no Mock API. Use dev-curador.',
    })
    return false
  }

  return true
}

app.get('/api/curadores/eu', async (req, reply) => {
  if (!requireMockCurator(req, reply)) return

  return {
    id: 'dev-curador',
    nome: 'Curador de Desenvolvimento',
  }
})

app.post('/api/versoes/:id/decisao', async (req, reply) => {
  if (!requireMockCurator(req, reply)) return

  const db = await readDb()
  const { id } = req.params as { id: string }
  const body = req.body as {
    decisao?: string
    justificativa?: string
  }
  const version = db.jogos.flatMap((game) => game.versoes).find((item) => item.id === id)

  if (!version) {
    return reply.code(404).send({ erro: 'Versão não encontrada.' })
  }

  if (version.estado !== 'submetido') {
    return reply.code(409).send({ erro: 'Esta versão já foi decidida.' })
  }

  if (body.decisao !== 'aprovado' && body.decisao !== 'reprovado') {
    return reply.code(400).send({
      erro: 'decisao deve ser aprovado ou reprovado.',
    })
  }

  if (body.decisao === 'reprovado' && !body.justificativa?.trim()) {
    return reply.code(422).send({ erro: 'A reprovação exige justificativa.' })
  }

  const game = db.jogos.find((item) => item.id === version.jogo_id)!

  version.estado = body.decisao
  version.decidido_em = now()
  version.decidido_por = 'dev-curador'
  version.justificativa = body.justificativa?.trim()
  game.status = body.decisao

  db.decisoes.push({
    id: randomUUID(),
    versao_id: id,
    decisao: body.decisao,
    justificativa: body.justificativa?.trim() || '',
    curador: 'dev-curador',
    quando: now(),
  })

  await writeDb(db)

  return publicGame(db, game)
})

app.get('/api/ranking/jogadores', async (req, reply) => {
  const db = await readDb()
  const { jogo } = req.query as { jogo?: string }

  if (!jogo) {
    return reply.code(400).send({
      codigo: 'REQUISICAO_INVALIDA',
      erro: 'Informe o jogo no parâmetro ?jogo=.',
    })
  }

  if (!db.jogos.some((game) => game.id === jogo)) {
    return reply.code(404).send({
      codigo: 'JOGO_NAO_ENCONTRADO',
      erro: 'Jogo não encontrado.',
    })
  }

  return rankingJogadores(db, jogo)
})

app.get('/api/ranking/jogos', async () => {
  const db = await readDb()

  return rankingJogos(db)
})

app.post('/api/ranking/jogadores/anonimizar', async (req, reply) => {
  if (!requireMockCurator(req, reply)) return

  const db = await readDb()
  const { apelido, jogo } = req.body as {
    apelido?: string
    jogo?: string
  }

  if (!apelido?.trim()) {
    return reply.code(400).send({
      codigo: 'REQUISICAO_INVALIDA',
      erro: 'Informe o apelido.',
    })
  }

  if (jogo && !db.jogos.some((game) => game.id === jogo)) {
    return reply.code(404).send({
      codigo: 'JOGO_NAO_ENCONTRADO',
      erro: 'Jogo não encontrado.',
    })
  }

  let changed = false
  let partidas = 0
  let votos = 0

  for (const score of db.placares) {
    if (score.jogador === apelido && (!jogo || score.jogo_id === jogo)) {
      score.jogador = 'ANON'
      changed = true
      partidas += 1
    }
  }

  for (const feedback of db.feedbacks) {
    if (feedback.jogador === apelido && (!jogo || feedback.jogo_id === jogo)) {
      feedback.jogador = 'ANON'
      votos += 1
    }
  }

  if (!changed) {
    return reply.code(404).send({ erro: 'Apelido não encontrado.' })
  }

  db.anonimizações.push({
    anterior: apelido,
    novo: 'ANON',
    quando: now(),
  })

  await writeDb(db)

  return {
    ok: true,
    apelido_anterior: apelido,
    apelido_novo: 'ANON',
    partidas,
    votos,
  }
})

// Endpoint de teste da fronteira G3 -> API. G2 não é dono desse fluxo; o mock só permite reproduzi-lo localmente.
app.post('/api/placares', async (req, reply) => {
  const db = await readDb()
  const body = req.body as Partial<Placar> & {
    jogoId?: string | number
    nota?: number
    comentario?: string
  }
  const jogoId = String(body.jogo_id ?? body.jogoId ?? '')
  const jogador = String(body.jogador ?? '').toUpperCase().slice(0, 9)
  const idPartida = String(body.id_partida ?? randomUUID())

  if (!jogoId || !jogador || !Number.isFinite(Number(body.pontos))) {
    return reply.code(422).send({
      erro: 'jogo_id, jogador e pontos são obrigatórios.',
    })
  }

  if (db.placares.some((score) => score.id_partida === idPartida)) {
    return reply.code(200).send({ ok: true, duplicado: true })
  }

  const score: Placar = {
    id_partida: idPartida,
    jogo_id: jogoId,
    versao_id: body.versao_id,
    jogador,
    pontos: Number(body.pontos),
    duracao_s: body.duracao_s,
    acertos: body.acertos,
    erros: body.erros,
    tema: body.tema,
    jogado_em: body.jogado_em || now(),
  }

  db.placares.push(score)

  if (body.nota && Number(body.nota) >= 1 && Number(body.nota) <= 5) {
    db.feedbacks.push({
      partida_id: idPartida,
      jogo_id: jogoId,
      jogador,
      nota: Number(body.nota),
      comentario: body.comentario,
      criado_em: now(),
    })
  }

  await writeDb(db)

  return reply.code(201).send({ ok: true, placar: score })
})

app.post('/api/resultados', async (req, reply) => {
  const response = await app.inject({
    method: 'POST',
    url: '/api/placares',
    payload: req.body as Record<string, unknown>,
  })

  return reply.code(response.statusCode).send(response.json())
})

await fs.mkdir(path.dirname(dataFile), { recursive: true })

try {
  await fs.access(dataFile)
} catch {
  await writeDb({
    jogos: [],
    placares: [],
    feedbacks: [],
    decisoes: [],
    anonimizações: [],
  })
}

await app.register(fastifyStatic, {
  root: publicDir,
  prefix: '/mock-public/',
})

try {
  await fs.access(webDist)
  await app.register(fastifyStatic, {
    root: webDist,
    decorateReply: false,
  })
} catch {}

app.setNotFoundHandler(async (req, reply) => {
  if (
    req.method === 'GET' &&
    !req.url.startsWith('/api/') &&
    !req.url.startsWith('/health')
  ) {
    try {
      return reply.sendFile('index.html')
    } catch {
      return reply.code(404).send({ erro: 'Rota não encontrada.' })
    }
  }

  return reply.code(404).send({ erro: 'Rota não encontrada.' })
})

await app.listen({
  port: Number(process.env.PORT || 3000),
  host: '0.0.0.0',
})
