/* =========================================================
   Login e Cadastro (mock)
   Sem backend por enquanto: validamos apenas no front-end
   e simulamos sucesso salvando um "usuário logado" fictício.
   Quando a API existir, troque validarLogin()/criarConta()
   por chamadas fetch().
   ========================================================= */

function marcarErro(inputId, temErro) {
  document.getElementById(inputId).closest(".field").classList.toggle("has-error", temErro);
}

/* ---------- LOGIN ---------- */
const loginForm = document.getElementById("login-form");
if (loginForm) {
  // Mostra mensagem de sucesso se o usuário acabou de se cadastrar
  const params = new URLSearchParams(window.location.search);
  if (params.get("cadastro") === "sucesso") {
    const banner = document.getElementById("error-banner");
    banner.textContent = "Conta criada com sucesso! Faça login para continuar.";
    banner.classList.add("is-visible", "is-success");
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    const senhaOk = senha.value.length >= 6;

    marcarErro("email", !emailOk);
    marcarErro("senha", !senhaOk);

    if (!emailOk || !senhaOk) return;

    // Mock: qualquer e-mail/senha válidos entram (sem backend ainda)
    localStorage.setItem("recreioArcadeUsuario", JSON.stringify({ email: email.value.trim() }));
    window.location.href = "catalogo.html";
  });
}

/* ---------- CADASTRO ---------- */
const cadastroForm = document.getElementById("cadastro-form");
if (cadastroForm) {
  cadastroForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const apelido = document.getElementById("apelido");
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");
    const confirmar = document.getElementById("confirmar-senha");

    const apelidoOk = apelido.value.trim().length > 0;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    const senhaOk = senha.value.length >= 6;
    const confirmarOk = confirmar.value === senha.value && senhaOk;

    marcarErro("apelido", !apelidoOk);
    marcarErro("email", !emailOk);
    marcarErro("senha", !senhaOk);
    marcarErro("confirmar-senha", !confirmarOk);

    if (!apelidoOk || !emailOk || !senhaOk || !confirmarOk) return;

    // Mock: simula criação de conta e manda para o login
    window.location.href = "index.html?cadastro=sucesso";
  });
}
