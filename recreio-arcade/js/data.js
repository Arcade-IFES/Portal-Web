/* Dados do Portal.
   Agora o frontend consulta o Fastify do G2. Se a API estiver indisponível,
   mantém os dados do protótipo para a tela não ficar vazia durante a apresentação.
*/
const API_BASE_URL = window.RECREIO_API_URL || 'http://localhost:3000/api';

function gerarCapa(titulo, corA, corB) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="220"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${corA}"/><stop offset="100%" stop-color="${corB}"/></linearGradient></defs><rect width="400" height="220" fill="url(#g)"/><text x="200" y="120" font-family="Arial" font-size="30" font-weight="700" fill="#fff" text-anchor="middle">${titulo}</text></svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const MOCK_CATALOGO = [
  {id:1,titulo:'Aventura Épica',autor:'Pedro Paglioni',resumo:'Uma jornada de espada e magia por reinos esquecidos.',nota:9,avaliacoes:10,capa:gerarCapa('Aventura Épica','#2f6b3a','#173b1f'),status:'aprovado'},
  {id:2,titulo:'Galaxy Quest',autor:'Lucas Rocha, Maria Silva',resumo:'Explore planetas desconhecidos numa odisseia espacial 2D.',nota:8.4,avaliacoes:24,capa:gerarCapa('Galaxy Quest','#1e3a5f','#0c1c33'),status:'aprovado'},
  {id:3,titulo:'Labirinto de Cristal',autor:'Isac Victor',resumo:'Puzzle-platformer com mecânicas de luz e reflexo.',nota:8.9,avaliacoes:15,capa:gerarCapa('Labirinto','#1b4b4a','#0c2323'),status:'submetido'}
];

const MOCK_RANKING = [
  {pos:1,apelido:'DragonSlayer99',pontos:99999},{pos:2,apelido:'PixelQueen',pontos:99999},{pos:3,apelido:'NeonRider',pontos:99999},{pos:4,apelido:'SombraViva',pontos:9999}
];
const MOCK_RANKING_JOGOS = MOCK_CATALOGO.filter(j=>j.status==='aprovado').map((j,i)=>({pos:i+1,jogo:j.titulo,nota:j.nota,votos:j.avaliacoes,metrica:j.nota}));

const API_DATA_READY = (async () => {
  try {
    const [jogos, ranking, rankingJogos, moderacao] = await Promise.all([
      fetch(`${API_BASE_URL}/jogos?status=aprovado`).then(r=>{if(!r.ok) throw new Error(); return r.json();}),
      fetch(`${API_BASE_URL}/ranking/jogadores`).then(r=>{if(!r.ok) throw new Error(); return r.json();}),
      fetch(`${API_BASE_URL}/ranking/jogos`).then(r=>{if(!r.ok) throw new Error(); return r.json();}),
      fetch(`${API_BASE_URL}/moderacao?status=submetido`).then(r=>{if(!r.ok) throw new Error(); return r.json();})
    ]);
    const detalhe = jogos[0] ? await fetch(`${API_BASE_URL}/jogos/${jogos[0].id}`).then(r=>r.json()) : null;
    window.CATALOGO_JOGOS = jogos;
    window.RANKING_JOGADORES_GERAL = ranking;
    window.RANKING_JOGOS = rankingJogos;
    window.FILA_MODERACAO = moderacao;
    window.JOGO_APROVADO_DETALHE = detalhe || jogos[0];
    window.JOGO_REPROVADO = jogos[0];
    window.RANKING_JOGADORES_POR_JOGO = {};
    return true;
  } catch {
    window.CATALOGO_JOGOS = MOCK_CATALOGO;
    window.RANKING_JOGADORES_GERAL = MOCK_RANKING;
    window.RANKING_JOGOS = MOCK_RANKING_JOGOS;
    window.FILA_MODERACAO = MOCK_CATALOGO.filter(j=>j.status==='submetido');
    window.JOGO_APROVADO_DETALHE = MOCK_CATALOGO[0];
    window.JOGO_REPROVADO = MOCK_CATALOGO[0];
    window.RANKING_JOGADORES_POR_JOGO = {'Aventura Épica':MOCK_RANKING};
    return false;
  }
})();
