export type StatusJogo = 'submetido' | 'aprovado' | 'reprovado';

export interface Jogo {
  id: number;
  nome: string;
  versao: string;
  descricao: string;
  resumo: string;
  autores: string[];
  controles: string;
  tema?: string;
  nivel?: string;
  status: StatusJogo;
  capa?: string;
  caminho?: string;
  nota_media: number;
  votos: number;
  justificativa?: string | null;
  aprovado_por?: string | null;
  data_aprovacao?: string | null;
  reprovado_por?: string | null;
  data_reprovacao?: string | null;
  arquivo?: string | null;
}

export interface Placar {
  id: number;
  external_id?: string;
  jogo_id: number;
  matricula?: string;
  apelido: string;
  pontos: number;
  data_hora: string;
}

export interface Feedback {
  id: number;
  jogo_id: number;
  apelido: string;
  nota: number;
  comentario_opcional?: string;
  data_hora: string;
}

export interface ResultadoPartida {
  id: string;
  matricula: string;
  apelido: string;
  jogoId: number;
  pontuacao: number;
  avaliacao: number;
  comentario_opcional?: string;
}

export interface Database {
  jogos: Jogo[];
  placares: Placar[];
  feedbacks: Feedback[];
  resultados_recebidos: string[];
  proximo_id_jogo: number;
  proximo_id_placar: number;
  proximo_id_feedback: number;
}
