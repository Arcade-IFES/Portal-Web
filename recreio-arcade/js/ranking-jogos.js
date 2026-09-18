renderHeader({title:'Ranking de Jogos',subtitleHtml:'Escolhidos pela Comunidade'}); renderFooterNav('ranking-jogos');
document.querySelector('.modal-close').innerHTML=ICONS.close; document.getElementById('btn-metric-info').innerHTML=ICONS.info;
document.getElementById('metric-title-icon').innerHTML=`${ICONS.info} Sobre a Métrica`;
document.getElementById('explain-nota').innerHTML=`${ICONS.star}<div><strong>Nota média</strong><span>Média das avaliações dos jogadores.</span></div>`;
document.getElementById('explain-partidas').innerHTML=`${ICONS.gamepad}<div><strong>Partidas jogadas</strong><span>Quantidade de partidas registradas.</span></div>`;
document.getElementById('explain-jogadores').innerHTML=`${ICONS.users}<div><strong>Jogadores distintos</strong><span>Quantidade de jogadores diferentes.</span></div>`;
document.getElementById('btn-metric-info').addEventListener('click',()=>openModal('modal-metrica'));
API_DATA_READY.then(()=>{document.getElementById('ranking-jogos-body').innerHTML=RANKING_JOGOS.map(r=>`<tr><td><span class="rank-pos">${r.pos===1?'🥇':r.pos===2?'🥈':r.pos===3?'🥉':''}${r.pos}</span></td><td>${r.jogo}</td><td class="is-numeric">${Number(r.nota).toFixed(1)}/10</td><td class="is-numeric">${Number(r.votos).toLocaleString('pt-BR')}</td><td class="is-numeric rank-points">${Number(r.metrica).toFixed(3)}</td></tr>`).join('');});
