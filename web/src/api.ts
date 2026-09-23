export type EstadoVersao = 'submetido' | 'aprovado' | 'reprovado' | 'substituida'

export type GameVersion = {
  id: string
  jogo_id: string
  versao: string
  estado: EstadoVersao
  submetido_em: string
  decidido_em?: string
  decidido_por?: string
  justificativa?: string
  repositorio_url?: string
  preview_url?: string
}

export type Feedback = {
  partida_id?: string
  apelido: string
  nota: number
  comentario?: string
  criado_em?: string
}

export type AccuracyByTheme = {
  tema: string
  acertos: number
  erros: number
  taxa: number
}

export type Game = {
  id: string
  nome: string
  descricao: string
  resumo: string
  classico_referencia?: string
  mecanica?: string
  tema: string
  nivel: string
  autores: string[]
  controles: string
  versao: string
  status: EstadoVersao
  capa?: string
  tamanho_bytes?: number
  sha256?: string
  nota_media: number
  votos: number
  jogadores_distintos?: number
  partidas_jogadas?: number
  repositorio_url?: string
  preview_url?: string
  versoes?: GameVersion[]
  feedbacks?: Feedback[]
  taxa_acerto_tema?: AccuracyByTheme[]
}

export type PlayerRank = {
  posicao: number
  apelido: string
  pontos: number
  jogo_id?: string
  jogo?: string
}

export type GameRank = {
  posicao: number
  jogo_id: string
  jogo: string
  nota: number
  votos: number
  partidas: number
  jogadores_distintos: number
  nota_ajustada: number
}

const baseUrl = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init?.headers || {}),
    },
  })

  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const message = body?.erro || body?.message || `Erro HTTP ${response.status}`
    throw new Error(message)
  }

  return body as T
}

export const api = {
  health: () => request<{ ok: boolean; service: string }>('/health'),

  jogos: (status = 'aprovado') =>
    request<Game[]>(`/jogos?status=${encodeURIComponent(status)}`),

  jogo: (id: string) => request<Game>(`/jogos/${encodeURIComponent(id)}`),

  submeterJogo: (payload: {
    nome: string
    versao: string
    descricao: string
    resumo: string
    autores: string[]
    controles: string
    repositorio_url: string
  }) =>
    request<Game>('/jogos', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  decisoesPendentes: () => request<Game[]>('/jogos?status=submetido'),

  decidirVersao: (
    versaoId: string,
    payload: {
      decisao: 'aprovado' | 'reprovado'
      justificativa: string
      curador: string
    },
  ) =>
    request<Game>(`/versoes/${encodeURIComponent(versaoId)}/decisao`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  rankingJogadores: (jogo?: string) =>
    request<PlayerRank[]>(
      `/ranking/jogadores${jogo ? `?jogo=${encodeURIComponent(jogo)}` : ''}`,
    ),

  rankingJogos: () => request<GameRank[]>('/ranking/jogos'),

  anonimizarJogador: (apelido: string) =>
    request<{
      ok: boolean
      apelido_anterior: string
      apelido_novo: string
    }>('/ranking/jogadores/anonimizar', {
      method: 'POST',
      body: JSON.stringify({ apelido }),
    }),
}
