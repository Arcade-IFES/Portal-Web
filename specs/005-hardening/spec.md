# Spec 005 — Hardening de build, deploy e legibilidade do código

## Objetivo

Garantir que o repositório G2 tenha uma cadeia de build previsível, que o mock de integração possa ser iniciado pelo comando definido no projeto e que o código-fonte permaneça legível para revisão humana e manutenção.

## Diagnóstico atual

Durante a revisão do projeto foram identificados três pontos concretos:

1. O `mock-api/tsconfig.json` precisava declarar `rootDir: "src"` para que o TypeScript gerasse `dist/server.js`, caminho utilizado pelo script `start`.
2. O mock registra `@fastify/static` duas vezes quando `web/dist` existe. O segundo registro precisa usar `decorateReply: false` para não tentar registrar novamente o decorator `sendFile`.
3. A rota de compatibilidade `POST /api/resultados` usa `app.inject()` com `req.body`. Como o corpo é `unknown` no Fastify, o payload deve ser explicitamente tratado como `Record<string, unknown>` para satisfazer a tipagem de `inject()`.

A pasta `api/` anterior foi removida por não participar dos scripts atuais e por duplicar uma implementação antiga do mock.

## Requisitos

### RQ-001 — Build do mock

O comando de build do projeto deve produzir `mock-api/dist/server.js`.

### RQ-002 — Inicialização do mock com frontend compilado

Quando `web/dist` existir, o mock deve iniciar sem conflito de decorators do `@fastify/static`.

### RQ-003 — Compatibilidade G3

A rota `POST /api/resultados` deve continuar encaminhando a requisição para `POST /api/placares` sem alterar o contrato funcional existente.

### RQ-004 — Legibilidade

Arquivos TypeScript/TSX do código principal devem usar indentação consistente, blocos separados, tipos multilinha quando necessário e evitar linhas excessivamente longas quando isso melhorar a leitura.

A formatação não deve alterar comportamento, contratos, nomes de rotas, mensagens, regras de negócio ou dados.

### RQ-005 — Fronteira de responsabilidades

As alterações devem continuar restritas ao hardening do G2. O mock não deve ser apresentado como API oficial do G1 e o G2 não deve assumir a responsabilidade de produção do fluxo G3.

## Critérios de aceitação

- `mock-api/tsconfig.json` possui `rootDir: "src"`.
- A rota `/api/resultados` usa um payload tipado para `app.inject()`.
- O segundo registro de `@fastify/static` usa `decorateReply: false`.
- Não existe mais a pasta `api/` órfã.
- O código principal está formatado para revisão humana sem mudança funcional intencional.
- O Spec-Kit documenta o diagnóstico, as correções e as verificações futuras.
