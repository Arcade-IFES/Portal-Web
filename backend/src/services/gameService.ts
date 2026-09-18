import type { Database, Jogo } from '../types.js';

export function enrichGame(db: Database, game: Jogo) {
  const feedbacks = db.feedbacks.filter(f => f.jogo_id === game.id);
  const nota = feedbacks.length ? feedbacks.reduce((s, f) => s + f.nota, 0) / feedbacks.length : game.nota_media;
  const placares = db.placares.filter(p => p.jogo_id === game.id);
  const jogadores = new Set(placares.map(p => p.apelido)).size;
  return {
    ...game,
    autor: game.autores.join(', '),
    titulo: game.nome,
    nota: Number(nota.toFixed(1)),
    avaliacoes: feedbacks.length || game.votos,
    caminho: game.caminho ?? `/jogos/${game.id}/index.html`,
    jogadores_distintos: jogadores,
    partidas_jogadas: placares.length
  };
}

export function publicCatalog(db: Database, status?: string) {
  return db.jogos
    .filter(j => !status || j.status === status)
    .map(j => enrichGame(db, j));
}
