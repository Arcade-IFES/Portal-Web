import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Database } from '../types.js';

const dataDir = path.resolve(process.env.DATA_DIR ?? './data');
const dbFile = path.join(dataDir, 'db.json');

const initialDb: Database = {
  jogos: [
    { id: 1, nome: 'Aventura Épica', versao: '1.0.3', descricao: 'Uma jornada de espada e magia por reinos esquecidos, repleta de dragões e tesouros.', resumo: 'Uma jornada de espada e magia por reinos esquecidos.', autores: ['Pedro Paglioni'], controles: 'Setas e Espaço', tema: 'Aventura', nivel: 'Livre', status: 'aprovado', nota_media: 9, votos: 10, capa: '', caminho: '/jogos/1/index.html', aprovado_por: 'Eliabe', data_aprovacao: '2026-08-25' },
    { id: 2, nome: 'Galaxy Quest', versao: '1.0.0', descricao: 'Explore, desafie e descubra planetas desconhecidos numa odisseia espacial 2D.', resumo: 'Explore planetas desconhecidos numa odisseia espacial 2D.', autores: ['Lucas Rocha', 'Maria Silva'], controles: 'Setas e Espaço', tema: 'Ciências', nivel: 'Ensino Médio', status: 'aprovado', nota_media: 8.4, votos: 24, capa: '', caminho: '/jogos/2/index.html', aprovado_por: 'Curadoria', data_aprovacao: '2026-08-31' },
    { id: 3, nome: 'Labirinto de Cristal', versao: '1.0.0', descricao: 'Puzzle-platformer com mecânicas de luz e reflexo.', resumo: 'Atravesse câmaras de cristal usando lógica.', autores: ['Isac Victor'], controles: 'Setas e Espaço', tema: 'Lógica', nivel: 'Ensino Médio', status: 'submetido', nota_media: 0, votos: 0, capa: '', caminho: '/jogos/3/index.html' },
    { id: 4, nome: 'Guerra de Tribos', versao: '1.0.0', descricao: 'Estratégia por turnos em um mapa procedural.', resumo: 'Conquiste território e tome decisões estratégicas.', autores: ['Eliabe Souza'], controles: 'Setas e Enter', tema: 'Estratégia', nivel: 'Ensino Médio', status: 'submetido', nota_media: 0, votos: 0, capa: '', caminho: '/jogos/4/index.html' }
  ],
  placares: [
    { id: 1, jogo_id: 1, apelido: 'DragonSlayer99', pontos: 99999, data_hora: '2026-08-31T10:30:00Z' },
    { id: 2, jogo_id: 1, apelido: 'PixelQueen', pontos: 99999, data_hora: '2026-08-31T11:00:00Z' },
    { id: 3, jogo_id: 2, apelido: 'NeonRider', pontos: 87000, data_hora: '2026-08-31T12:00:00Z' }
  ],
  feedbacks: [
    { id: 1, jogo_id: 1, apelido: 'Jogador12', nota: 9, comentario_opcional: 'História envolvente.', data_hora: '2026-08-31T13:00:00Z' },
    { id: 2, jogo_id: 1, apelido: 'Maria_S', nota: 8, comentario_opcional: 'Ótima trilha sonora.', data_hora: '2026-08-31T14:00:00Z' }
  ],
  resultados_recebidos: [],
  proximo_id_jogo: 5,
  proximo_id_placar: 4,
  proximo_id_feedback: 3
};

export async function initDb(): Promise<void> {
  await mkdir(dataDir, { recursive: true });
  try { await readFile(dbFile, 'utf8'); }
  catch { await writeFile(dbFile, JSON.stringify(initialDb, null, 2)); }
}

export async function getDb(): Promise<Database> {
  return JSON.parse(await readFile(dbFile, 'utf8')) as Database;
}

export async function saveDb(db: Database): Promise<void> {
  await writeFile(dbFile, JSON.stringify(db, null, 2));
}
