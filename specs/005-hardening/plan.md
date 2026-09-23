# Plano — Hardening de build, deploy e legibilidade

## Diagnóstico

A revisão encontrou uma cadeia de falhas que se mascaravam em sequência:

```text
configuração do TypeScript
        ↓
rootDir ausente
        ↓
saída em dist/src/server.js
        ↓
start procura dist/server.js
```

Depois da correção de `rootDir`, a checagem de tipos passou a alcançar a rota `/api/resultados`, revelando a incompatibilidade de `unknown` com o overload de `app.inject()`.

Também foi reproduzido um conflito no boot quando `web/dist` existe, causado pelo segundo registro de `@fastify/static` sem `decorateReply: false`.

## Correções prognósticas

1. Fixar a saída do TypeScript com `rootDir` e `outDir`.
2. Tipar explicitamente o payload da rota de compatibilidade.
3. Manter `decorateReply: false` no segundo registro de arquivos estáticos.
4. Manter somente `mock-api/` como mock atual.
5. Formatar o código principal para leitura humana sem alterar a lógica.
6. Repetir a validação de build e boot após a instalação das dependências.
7. Antes de um deploy real, validar a integração com o contrato efetivo publicado pelo G1.

## Fora de escopo

- Alterar a API oficial do G1.
- Alterar o fluxo interno do G3.
- Alterar contratos do G4.
- Adicionar autenticação não prevista no contrato.
- Alterar regras de ranking ou de curadoria apenas por motivo de formatação.
