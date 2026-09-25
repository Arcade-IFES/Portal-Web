# Feature Specification: Integração do Portal G2 com a API oficial do G1

**Feature:** 006-integracao-api-g1
**Status:** Em implementação

## Diagnóstico

O Grupo 1 disponibilizou a API oficial da Plataforma de Gestão e a documentação de integração para os demais grupos.

A integração atual do Portal G2 ainda estava baseada no contrato do Mock API. O contrato oficial do G1 estabelece:

- `GET /api/jogos` para catálogo e fila de curadoria por `status`;
- `GET /api/jogos/{id}` para detalhes;
- `POST /api/jogos` com `{ repositorio_url, ref, resumo? }` para submissão;
- `GET /api/curadores/eu` para validar um token `cur_...`;
- `POST /api/versoes/{versao_id}/decisao` para curadoria autenticada;
- `GET /api/ranking/jogadores?jogo=<id>` para ranking por jogo;
- `GET /api/ranking/jogos` para ranking de jogos;
- `POST /api/ranking/jogadores/anonimizar` para anonimização autenticada.

O G1 informa que consultas de catálogo e rankings, bem como submissões, são públicas; operações de curadoria, estações e anonimização usam token de curador. Os erros seguem `{ "codigo": "...", "erro": "mensagem" }`.

A API também fornece `capa_url` e `preview_url`, que devem ser consumidos diretamente pelo Portal.

## Objetivo

Migrar o Portal G2 para usar a API oficial do G1 como fonte de dados de produção, preservando o Mock API como alternativa de desenvolvimento local.

## Responsabilidades preservadas

- G2 continua responsável pela interface do Portal e pela apresentação/entrada de dados.
- G1 continua responsável por API, persistência, ingestão, placares e cálculos oficiais.
- G3 continua responsável pelo fliperama local, execução, sincronização e envio de placares ao G1.
- G4 continua responsável pelos jogos e seus contratos.

## Requisitos funcionais

### RF-006-01 — API oficial
O Portal deve centralizar chamadas HTTP em `web/src/api.ts` e aceitar a URL por `VITE_API_BASE_URL`.

### RF-006-02 — Submissão
O formulário deve enviar apenas `repositorio_url`, `ref` e `resumo` opcional.

### RF-006-03 — Curador
O Portal deve aceitar um token `cur_...`, validá-lo por `/curadores/eu` e manter o token somente durante a sessão do navegador.

### RF-006-04 — Curadoria
A fila deve vir de `/jogos?status=submetido`; o preview deve usar `preview_url`; decisões devem usar o token do curador e não devem enviar `curador` no corpo.

### RF-006-05 — Ranking de jogadores
O Portal deve exigir um jogo selecionado e consultar `/ranking/jogadores?jogo=<id>`. Não deve existir ranking geral de jogadores no Portal.

### RF-006-06 — Ranking de jogos
O Portal deve exibir os valores devolvidos por `/ranking/jogos`, sem recalcular o ranking.

### RF-006-07 — Detalhes e feedback
O Portal deve exibir `feedbacks` e `taxa_acerto_tema` fornecidos pelo G1.

### RF-006-08 — Imagens e preview
O Portal deve consumir `capa_url` e `preview_url` fornecidos pela API, sem montar URLs manualmente.

### RF-006-09 — Anonimização
O Portal deve chamar a operação oficial de anonimização com token de curador e, no ranking por jogo, informar o jogo atualmente selecionado.

### RF-006-10 — Mock local
O Mock API deve continuar disponível para desenvolvimento local e reproduzir o contrato principal necessário pelo Portal, sem ser considerado fonte oficial.

## Critérios de aceite

1. Com `VITE_API_BASE_URL=https://plataforma-gestao-api.onrender.com/api`, o catálogo usa a API do G1.
2. O formulário de submissão não solicita metadados que pertencem ao `game.json`.
3. Um token válido de curador é validado e o nome retornado é mostrado no painel.
4. Aprovar/reprovar envia apenas `decisao` e `justificativa` com `Authorization: Bearer cur_...`.
5. O ranking de jogadores não carrega sem um jogo selecionado.
6. O Portal não calcula rankings oficiais.
7. Erros da API exibem a mensagem do campo `erro`.
8. O Mock API continua utilizável em desenvolvimento local.
9. O projeto mantém a identidade visual neon/arcade do G2.
10. O build TypeScript/Vite deve ser executado antes da entrega e seu resultado deve ser registrado.
