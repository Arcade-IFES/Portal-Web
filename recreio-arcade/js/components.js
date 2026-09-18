/* =========================================================
   RECREIO ARCADE — Componentes compartilhados
   Header, footer de navegação e helpers de modal.
   Mantidos em JS para não duplicar o mesmo HTML em 9 páginas.
   ========================================================= */

/**
 * Desenha o cabeçalho padrão (logo + título + subtítulo).
 * @param {Object} opts
 * @param {string} opts.subtitleHtml - HTML já pronto do subtítulo (permite <span> coloridos e links de alternância).
 */
function renderHeader({ title, subtitleHtml = "" }) {
  const el = document.getElementById("app-header");
  if (!el) return;
  el.innerHTML = `
    <div class="app-header__inner">
      <a href="catalogo.html" class="brand">Recreio<br>Arcade</a>
      <div class="page-heading">
        <h1>${title}</h1>
        ${subtitleHtml ? `<p class="subtitle">${subtitleHtml}</p>` : ""}
      </div>
      <div class="header-spacer">
        <button class="btn-logout" id="btn-logout" title="Sair da conta">
          ${ICONS.logout}
          <span>Sair</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById("btn-logout").addEventListener("click", fazerLogout);
}

/**
 * Encerra a sessão mockada e volta para a tela de Login.
 * Quando existir backend, aqui entraria a chamada para
 * invalidar o token/sessão no servidor.
 */
function fazerLogout() {
  const confirmou = window.confirm("Deseja realmente sair da sua conta?");
  if (!confirmou) return;
  localStorage.removeItem("recreioArcadeUsuario");
  window.location.href = "index.html";
}

/**
 * Desenha a navegação inferior fixa, presente em todas as
 * telas do catálogo (não aparece em login/cadastro).
 * @param {"ranking-jogos"|"ranking-jogadores"|"upload"|"moderacao"|""} activeKey
 */
function renderFooterNav(activeKey = "") {
  const el = document.getElementById("app-footer");
  if (!el) return;

  const items = [
    { key: "ranking-jogos", href: "ranking-jogos.html", icon: "medal", label: "Ranking de Jogos" },
    { key: "ranking-jogadores", href: "ranking-jogadores.html", icon: "podium", label: "Ranking de Jogadores" },
    { key: "upload", href: "upload.html", icon: "uploadArrow", label: "Upload" },
    { key: "moderacao", href: "moderacao.html", icon: "chart", label: "Fila de Moderação" }
  ];

  el.innerHTML = `
    <nav class="footer-nav" aria-label="Navegação principal">
      ${items.map(item => `
        <a class="footer-nav__item ${item.key === activeKey ? "is-active" : ""}"
           href="${item.href}" title="${item.label}">
          ${ICONS[item.icon]}
          <span class="footer-nav__label visually-hidden">${item.label}</span>
        </a>
      `).join("")}
    </nav>
  `;
}

/* ---------------------------------------------------------
   Modais (avisos)
   Convenção: cada modal é um <div class="modal-overlay" id="...">
   já presente no HTML da página. Estas funções só controlam
   a visibilidade e o fechamento por clique fora / Esc.
--------------------------------------------------------- */

function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove("is-open");
  document.body.style.overflow = "";
}

// Fecha modal clicando fora da caixa ou apertando Esc
document.addEventListener("click", (e) => {
  if (e.target.classList && e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("is-open");
    document.body.style.overflow = "";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-overlay.is-open").forEach(m => {
      m.classList.remove("is-open");
    });
    document.body.style.overflow = "";
  }
});
