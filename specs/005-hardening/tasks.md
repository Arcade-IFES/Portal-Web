# Tarefas — Hardening de build, deploy e legibilidade

## Diagnóstico

- [x] Identificar a saída incorreta causada pela ausência de `rootDir`.
- [x] Identificar o conflito do decorator `sendFile` no segundo `@fastify/static`.
- [x] Identificar a incompatibilidade de tipo em `app.inject()` na rota `/api/resultados`.
- [x] Identificar a pasta `api/` como implementação órfã.

## Correções

- [x] Adicionar `rootDir: "src"` ao `mock-api/tsconfig.json`.
- [x] Adicionar `decorateReply: false` ao segundo registro de `@fastify/static`.
- [x] Usar `req.body as Record<string, unknown>` no `payload` de `app.inject()`.
- [x] Remover a pasta `api/` órfã.
- [x] Formatar `mock-api/src/server.ts` sem alterar sua lógica.
- [x] Melhorar a formatação dos arquivos TypeScript/TSX principais sem alterar conteúdo funcional.

## Verificação

- [ ] Executar `npm install` com acesso à rede.
- [ ] Executar `npm run build` e confirmar código de saída `0`.
- [ ] Confirmar que `mock-api/dist/server.js` existe após o build.
- [ ] Executar `npm start` com `web/dist` presente.
- [ ] Confirmar `/health` e `/api/health`.
- [ ] Repetir os testes da API descritos em `docs/TESTES-API.md`.
- [ ] Validar o deploy de demonstração no Render.

> As tarefas de verificação marcadas como pendentes dependem da instalação das dependências e de um ambiente de execução com rede disponível. Elas não devem ser marcadas como concluídas apenas por inspeção estática.
