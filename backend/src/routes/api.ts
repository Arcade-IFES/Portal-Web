import type { FastifyInstance } from 'fastify';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import AdmZip from 'adm-zip';
import { getDb, saveDb } from '../services/databaseService.js';
import { enrichGame, publicCatalog } from '../services/gameService.js';
import { rankingJogadores, rankingJogos } from '../services/rankingService.js';
import type { ResultadoPartida, StatusJogo } from '../types.js';

function now() { return new Date().toISOString(); }
function validStatus(v: unknown): v is StatusJogo { return v === 'submetido' || v === 'aprovado' || v === 'reprovado'; }

export async function registerApi(app: FastifyInstance) {
  app.get('/health', async () => ({ status:'ok', sistema:'Recreio Arcade - G2', timestamp:now() }));

  const listGames = async (request:any) => {
    const db = await getDb();
    const status = request.query?.status;
    return publicCatalog(db, validStatus(status) ? status : undefined);
  };
  app.get('/api/jogos', listGames);
  app.get('/jogos', listGames); // compatibilidade com integrações simples do fliperama

  const gameDetails = async (request:any, reply:any) => {
    const db = await getDb();
    const game = db.jogos.find(j => j.id === Number(request.params.id));
    if (!game) return reply.code(404).send({ erro:'JOGO_NAO_ENCONTRADO' });
    return { ...enrichGame(db, game), feedbacks:db.feedbacks.filter(f=>f.jogo_id===game.id) };
  };
  app.get('/api/jogos/:id', gameDetails);
  app.get('/api/jogos/:id/download', async (request:any, reply:any) => {
    const db = await getDb();
    const game = db.jogos.find(j => j.id === Number(request.params.id));
    if (!game?.arquivo) return reply.code(404).send({erro:'PACOTE_NAO_DISPONIVEL'});
    const fs = await import('node:fs/promises');
    const file = path.resolve(process.env.UPLOAD_DIR ?? './uploads', game.arquivo);
    try {
      const data = await fs.readFile(file);
      reply.type('application/zip').header('Content-Disposition', `attachment; filename="jogo-${game.id}.zip"`).send(data);
    } catch {
      return reply.code(404).send({erro:'PACOTE_NAO_DISPONIVEL'});
    }
  });

  app.get('/api/moderacao', async (request:any) => {
    const db = await getDb();
    const status = validStatus(request.query?.status) ? request.query.status : 'submetido';
    return publicCatalog(db, status);
  });

  app.post('/api/jogos/:id/decisao', async (request:any, reply:any) => {
    const { decisao, justificativa, moderador } = request.body ?? {};
    const db = await getDb();
    const game = db.jogos.find(j=>j.id===Number(request.params.id));
    if (!game) return reply.code(404).send({erro:'JOGO_NAO_ENCONTRADO'});
    if (decisao !== 'aprovado' && decisao !== 'reprovado') return reply.code(400).send({erro:'DECISAO_INVALIDA'});
    if (decisao === 'reprovado' && !String(justificativa ?? '').trim()) return reply.code(400).send({erro:'JUSTIFICATIVA_OBRIGATORIA'});
    game.status = decisao;
    game.justificativa = justificativa ?? null;
    if (decisao === 'aprovado') { game.aprovado_por = moderador ?? 'G2'; game.data_aprovacao = now(); }
    else { game.reprovado_por = moderador ?? 'G2'; game.data_reprovacao = now(); }
    await saveDb(db);
    return { mensagem:`Jogo ${decisao} com sucesso`, jogo:enrichGame(db,game) };
  });

  app.post('/api/jogos/upload', async (request:any, reply:any) => {
    const parts = request.parts();
    let zipBuffer: Buffer | null = null;
    let metadata:any = {};
    let capaBuffer: Buffer | null = null;
    let capaName = '';
    for await (const part of parts) {
      if (part.type === 'file') {
        const buffer = await part.toBuffer();
        if (part.fieldname === 'zip' || part.fieldname === 'pacote') zipBuffer = buffer;
        if (part.fieldname === 'capa') { capaBuffer = buffer; capaName = part.filename; }
      } else metadata[part.fieldname] = part.value;
    }
    if (!zipBuffer) return reply.code(400).send({codigo:'PACOTE_AUSENTE', mensagem:'Envie o ZIP no campo zip ou pacote.'});
    if (zipBuffer.length > 20*1024*1024) return reply.code(422).send({codigo:'PACOTE_GRANDE', mensagem:'O ZIP não pode ultrapassar 20MB.'});
    try {
      const zip = new AdmZip(zipBuffer);
      const names = zip.getEntries().map(e=>e.entryName);
      if (!names.includes('index.html')) return reply.code(422).send({codigo:'SEM_INDEX', mensagem:'index.html precisa estar na raiz.'});
      if (!names.includes('game.json')) return reply.code(422).send({codigo:'SEM_MANIFESTO', mensagem:'game.json precisa estar na raiz.'});
      const manifest = JSON.parse(zip.readAsText('game.json'));
      if (!manifest.nome || !manifest.versao || !Array.isArray(manifest.autores)) return reply.code(422).send({codigo:'MANIFESTO_INVALIDO', mensagem:'game.json inválido.'});
      const db = await getDb();
      const id = db.proximo_id_jogo++;
      const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? './uploads', String(id));
      await mkdir(uploadDir,{recursive:true});
      await writeFile(path.join(uploadDir,'jogo.zip'),zipBuffer);
      if (capaBuffer) await writeFile(path.join(uploadDir,capaName || 'capa'),capaBuffer);
      const game = { id, nome:manifest.nome, versao:manifest.versao, descricao:manifest.descricao ?? metadata.descricao ?? '', resumo:manifest.resumo ?? metadata.resumo ?? '', autores:manifest.autores, controles:manifest.controles ?? metadata.controles ?? '', tema:manifest.tema ?? metadata.tema, nivel:manifest.nivel ?? metadata.nivel, status:'submetido' as const, nota_media:0, votos:0, arquivo:`${id}/jogo.zip`, capa:capaBuffer?`/uploads/${id}/${capaName}`:undefined, caminho:`/jogos/${id}/index.html` };
      db.jogos.push(game); await saveDb(db);
      return reply.code(201).send({mensagem:'Jogo enviado para moderação.', jogo:enrichGame(db,game)});
    } catch (e: any) { return reply.code(422).send({codigo:'PACOTE_INVALIDO', mensagem:e.message}); }
  });

  async function addScore(payload:any, reply:any) {
    const db = await getDb();
    const jogoId = Number(payload.jogoId ?? payload.jogo_id);
    const pontos = Number(payload.pontuacao ?? payload.pontos);
    if (!Number.isInteger(jogoId) || !Number.isFinite(pontos) || pontos < 0 || !payload.apelido) return reply.code(400).send({erro:'PLACAR_INVALIDO'});
    if (payload.id && db.resultados_recebidos.includes(String(payload.id))) return {status:'already_processed'};
    if (payload.id) db.resultados_recebidos.push(String(payload.id));
    db.placares.push({ id:db.proximo_id_placar++, external_id:payload.id, jogo_id:jogoId, matricula:payload.matricula, apelido:String(payload.apelido), pontos, data_hora:payload.data_hora ?? now() });
    if (payload.avaliacao !== undefined) {
      const nota=Number(payload.avaliacao); if (nota>=1 && nota<=10) db.feedbacks.push({id:db.proximo_id_feedback++,jogo_id:jogoId,apelido:String(payload.apelido),nota,comentario_opcional:payload.comentario_opcional,data_hora:now()});
    }
    await saveDb(db); return {status:'accepted'};
  }
  app.post('/api/resultados', async (request:any, reply:any) => addScore(request.body, reply));
  app.post('/resultados', async (request:any, reply:any) => addScore(request.body, reply));

  app.post('/api/jogos/:id/placar', async (request:any, reply) => addScore({...request.body, jogoId:Number(request.params.id)}, reply));

  app.post('/api/jogos/:id/feedback', async (request:any, reply:any) => {
    const db=await getDb(); const jogoId=Number(request.params.id); const jogo=db.jogos.find(j=>j.id===jogoId); const {apelido,nota,comentario_opcional}=request.body??{};
    if(!jogo) return reply.code(404).send({erro:'JOGO_NAO_ENCONTRADO'});
    if(!apelido || !Number.isInteger(nota) || nota<1 || nota>10) return reply.code(400).send({erro:'FEEDBACK_INVALIDO',mensagem:'A nota deve ser inteira entre 1 e 10 para manter compatibilidade com o protótipo do Portal.'});
    const feedback={id:db.proximo_id_feedback++,jogo_id:jogoId,apelido:String(apelido),nota,comentario_opcional:comentario_opcional??'',data_hora:now()}; db.feedbacks.push(feedback); await saveDb(db); return reply.code(201).send({feedback,jogo:enrichGame(db,jogo)});
  });

  app.get('/api/ranking/jogadores', async (request:any)=>{const db=await getDb(); return rankingJogadores(db,request.query?.jogo?Number(request.query.jogo):undefined);});
  app.get('/api/ranking/jogos', async()=>rankingJogos(await getDb()));
  app.get('/api/estatisticas', async()=>{const db=await getDb(); return {jogos:db.jogos.length,jogos_aprovados:db.jogos.filter(j=>j.status==='aprovado').length,jogos_submetidos:db.jogos.filter(j=>j.status==='submetido').length,jogos_reprovados:db.jogos.filter(j=>j.status==='reprovado').length,partidas:db.placares.length,feedbacks:db.feedbacks.length};});
}
