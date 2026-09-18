renderHeader({title:'Catálogo',subtitleHtml:'Jogos Aprovados'}); renderFooterNav('');
API_DATA_READY.then(()=>{
  const grid=document.getElementById('games-grid');
  grid.innerHTML=CATALOGO_JOGOS.map(j=>`<article class="game-card" data-id="${j.id}"><img class="game-card__cover" src="${j.capa||''}" alt="Capa de ${j.titulo}"><div class="game-card__body"><h3 class="game-card__title">${j.titulo}</h3><p class="game-card__meta">Autor: ${j.autor}</p><p class="game-card__resumo">Resumo: ${j.resumo}</p><div class="game-card__footer"><div><span class="game-card__nota">Nota: <span>${Number(j.nota||0).toFixed(1)}</span>/10</span><span class="game-card__avals">${j.avaliacoes||0} avaliações</span></div><button class="game-card__download" data-download aria-label="Baixar ${j.titulo}">${ICONS.download}</button></div></div></article>`).join('');
  grid.querySelectorAll('.game-card').forEach(card=>card.addEventListener('click',e=>{if(e.target.closest('[data-download]'))return;location.href=`detalhes-aprovado.html?id=${card.dataset.id}`;}));
  grid.querySelectorAll('[data-download]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();openModal('modal-download');}));
});
