import type { Database } from '../types.js';

export function rankingJogadores(db: Database, jogoId?: number) {
  const scores = db.placares.filter(s => !jogoId || s.jogo_id === jogoId);
  const best = new Map<string, number>();
  for (const s of scores) best.set(s.apelido, Math.max(best.get(s.apelido) ?? 0, s.pontos));
  return [...best.entries()].sort((a,b) => b[1]-a[1]).map(([apelido,pontos], i) => ({ posicao:i+1, pos:i+1, apelido, pontos }));
}

export function rankingJogos(db: Database) {
  return db.jogos.filter(j => j.status === 'aprovado').map(j => {
    const scores = db.placares.filter(s => s.jogo_id === j.id);
    const feedbacks = db.feedbacks.filter(f => f.jogo_id === j.id);
    const nota = feedbacks.length ? feedbacks.reduce((s,f)=>s+f.nota,0)/feedbacks.length : j.nota_media;
    const jogadores = new Set(scores.map(s=>s.apelido)).size;
    const partidas = scores.length;
    const metrica = Number((nota * 0.5 + Math.min(partidas / 100, 1) * 3 + Math.min(jogadores / 50, 1) * 2).toFixed(3));
    return { id:j.id, nome:j.nome, jogo:j.nome, nota:Number(nota.toFixed(1)), votos:feedbacks.length || j.votos, partidas_jogadas:partidas, jogadores_distintos:jogadores, metrica };
  }).sort((a,b)=>b.metrica-a.metrica).map((j,i)=>({posicao:i+1,pos:i+1,...j}));
}
