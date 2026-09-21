import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

interface Game {
  id: string;
  nome: string;
  versao: string;
  descricao: string;
  resumo: string;
  autores: string[];
  controles: string;
  repositorio_url: string;
  status: 'submetido' | 'aprovado' | 'reprovado';
  nota: number;
  avaliacoes: number;
  capa?: string;
  enviado_em: string;
  justificativa?: string;
}
interface Score { id_partida: string; jogo_id: string; versao_id?: string; jogador: string; pontos: number; duracao_s?: number; acertos?: number; erros?: number; tema?: string; jogado_em: string; estacao?: string; }
interface Feedback { id: string; jogo_id: string; apelido: string; nota: number; comentario_opcional?: string; criado_em: string; }
interface DB { jogos: Game[]; placares: Score[]; feedbacks: Feedback[]; decisoes: unknown[]; }

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const dataFile = process.env.DATA_FILE || path.join(root, 'api/data/db.json');
const app = Fastify({ logger: true });

async function readDb(): Promise<DB> { return JSON.parse(await fs.readFile(dataFile, 'utf8')) as DB; }
async function writeDb(db: DB) { await fs.mkdir(path.dirname(dataFile), { recursive: true }); await fs.writeFile(dataFile, JSON.stringify(db, null, 2)); }
function githubUrl(value: string) {
  try { const u = new URL(value); return u.protocol === 'https:' && (u.hostname === 'github.com' || u.hostname === 'www.github.com') && u.pathname.split('/').filter(Boolean).length >= 2; } catch { return false; }
}

await app.register(cors, { origin: true });

const health = async () => ({ ok: true, service: 'recreio-arcade-g2-mock-api', mode: 'mock-integration' });
app.get('/health', health);
app.get('/api/health', health);
app.get('/api', async () => ({ ok: true, message: 'API de integração/mock do Portal G2. Em produção, a URL deve apontar para a API oficial do G1.' }));

app.get('/api/jogos', async (req) => {
  const db = await readDb();
  const status = (req.query as { status?: string }).status;
  const games = status ? db.jogos.filter(j => j.status === status) : db.jogos;
  return games.map(j => ({ ...j, titulo: j.nome, autor: j.autores.join(', '), repositorio: j.repositorio_url }));
});

app.get('/api/jogos/:id', async (req, reply) => {
  const db = await readDb();
  const id = (req.params as { id: string }).id;
  const game = db.jogos.find(j => j.id === id);
  if (!game) return reply.code(404).send({ erro: 'Jogo não encontrado' });
  return { ...game, titulo: game.nome, autor: game.autores.join(', ') };
});

// MOCK ONLY: simula a API oficial para que G2 consiga testar o envio por URL antes da integração real com G1.
app.post('/api/jogos', async (req, reply) => {
  const body = req.body as Partial<Game> & { url?: string; repositorio?: string };
  const repo = body.repositorio_url || body.url || body.repositorio;
  if (!repo || !githubUrl(repo)) return reply.code(400).send({ codigo: 'REPOSITORIO_INVALIDO', erro: 'Informe uma URL pública válida do GitHub.' });
  if (!body.nome || !body.versao || !body.descricao || !body.resumo || !body.controles) return reply.code(400).send({ codigo: 'DADOS_INCOMPLETOS', erro: 'Nome, versão, descrição, resumo e controles são obrigatórios.' });
  const db = await readDb();
  const id = String(Date.now());
  const game: Game = { id, nome: body.nome, versao: body.versao, descricao: body.descricao, resumo: body.resumo, autores: Array.isArray(body.autores) ? body.autores : [], controles: body.controles, repositorio_url: repo, status: 'submetido', nota: 0, avaliacoes: 0, enviado_em: new Date().toISOString() };
  db.jogos.push(game); await writeDb(db);
  return reply.code(201).send(game);
});

app.get('/api/moderacao', async (req) => {
  const db = await readDb();
  const status = (req.query as { status?: string }).status || 'submetido';
  return db.jogos.filter(j => j.status === status);
});

app.post('/api/jogos/:id/decisao', async (req, reply) => {
  const db = await readDb();
  const id = (req.params as { id: string }).id;
  const body = req.body as { decisao?: string; justificativa?: string; moderador?: string };
  const game = db.jogos.find(j => j.id === id);
  if (!game) return reply.code(404).send({ erro: 'Jogo não encontrado' });
  if (body.decisao !== 'aprovado' && body.decisao !== 'reprovado') return reply.code(400).send({ erro: 'decisao deve ser aprovado ou reprovado' });
  game.status = body.decisao; game.justificativa = body.justificativa; db.decisoes.push({ jogo_id: id, ...body, criado_em: new Date().toISOString() });
  await writeDb(db); return { ok: true, jogo: game };
});

app.get('/api/ranking/jogadores', async (req) => {
  const db = await readDb();
  const jogo = (req.query as { jogo?: string }).jogo;
  const scores = jogo ? db.placares.filter(s => s.jogo_id === jogo) : db.placares;
  const best = new Map<string, number>();
  for (const s of scores) best.set(s.jogador, Math.max(best.get(s.jogador) ?? 0, s.pontos));
  return [...best.entries()].sort((a,b) => b[1]-a[1]).map(([apelido,pontos], i) => ({ pos: i+1, apelido, pontos }));
});

app.get('/api/ranking/jogos', async () => {
  const db = await readDb();
  const approved = db.jogos.filter(j => j.status === 'aprovado');
  return approved.map(j => {
    const votes = db.feedbacks.filter(f => f.jogo_id === j.id);
    const games = db.placares.filter(s => s.jogo_id === j.id);
    const nota = votes.length ? votes.reduce((sum, v) => sum + v.nota, 0) / votes.length : j.nota;
    return { jogo_id: j.id, jogo: j.nome, nota: Number(nota.toFixed(2)), votos: votes.length, partidas_jogadas: games.length };
  }).sort((a,b) => b.nota-a.nota || b.partidas_jogadas-a.partidas_jogadas).map((x,i) => ({ pos:i+1, ...x }));
});

// MOCK ONLY: simula recebimento de partida vindo do G3.
app.post('/api/placares', async (req, reply) => {
  const body = req.body as Partial<Score> & { pontos?: number; jogoId?: string | number };
  const db = await readDb();
  const score: Score = { id_partida: body.id_partida || randomUUID(), jogo_id: String(body.jogo_id ?? body.jogoId ?? ''), versao_id: body.versao_id, jogador: body.jogador || '', pontos: Number(body.pontos ?? 0), duracao_s: body.duracao_s, acertos: body.acertos, erros: body.erros, tema: body.tema, jogado_em: body.jogado_em || new Date().toISOString(), estacao: body.estacao };
  if (!score.jogo_id || !score.jogador) return reply.code(400).send({ erro: 'jogo_id e jogador são obrigatórios' });
  if (db.placares.some(s => s.id_partida === score.id_partida)) return { ok: true, duplicado: true, placar: score };
  db.placares.push(score); await writeDb(db); return reply.code(201).send({ ok:true, placar:score });
});
app.post('/api/jogos/:id/placar', async (req, reply) => {
  const id = (req.params as { id:string }).id;
  const body = req.body as { apelido?: string; pontos?: number; data_hora?: string };
  return app.inject({ method:'POST', url:'/api/placares', payload:{ id_partida:randomUUID(), jogo_id:id, jogador:body.apelido, pontos:body.pontos, jogado_em:body.data_hora } }).then(r => reply.code(r.statusCode).send(r.json()));
});
app.post('/api/jogos/:id/feedback', async (req, reply) => {
  const db = await readDb(); const id=(req.params as {id:string}).id; const body=req.body as {apelido?:string; nota?:number; comentario_opcional?:string};
  if (!body.apelido || !Number.isInteger(body.nota) || body.nota! < 1 || body.nota! > 5) return reply.code(400).send({erro:'apelido e nota inteira de 1 a 5 são obrigatórios'});
  const feedback:Feedback={id:randomUUID(),jogo_id:id,apelido:body.apelido,nota:body.nota,comentario_opcional:body.comentario_opcional,criado_em:new Date().toISOString()}; db.feedbacks.push(feedback); await writeDb(db); return reply.code(201).send(feedback);
});

const webDist = path.join(root, 'web/dist');
try { await fs.access(webDist); await app.register(fastifyStatic, { root: webDist }); app.get('/*', async (_req, reply) => reply.sendFile('index.html')); } catch { /* dev mode: Vite serves the frontend */ }

const port = Number(process.env.PORT || 3000);
await app.listen({ port, host: '0.0.0.0' });
