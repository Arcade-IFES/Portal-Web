# Implementation Plan: Integração com API oficial do G1

## Diagnóstico

A camada de API do G2 tinha tipos e payloads derivados do Mock API anterior. O contrato oficial do G1 agora é a referência de integração.

## Plano técnico

### 1. Camada HTTP
- manter `web/src/api.ts` como única camada HTTP;
- usar `VITE_API_BASE_URL`;
- anexar `Authorization: Bearer <token>` somente quando houver token de curador em sessão;
- centralizar leitura de `{ codigo, erro }`;
- preservar status HTTP no erro lançado.

### 2. Catálogo e detalhes
- consumir `capa_url` e `preview_url` diretamente;
- usar os campos oficiais de catálogo;
- manter `feedbacks` e `taxa_acerto_tema` como dados fornecidos pelo G1.

### 3. Submissão
- trocar o formulário antigo pelo contrato `repositorio_url + ref + resumo?`;
- manter validação básica no navegador;
- deixar validação do repositório, ref e manifesto para o G1.

### 4. Curadoria
- adicionar validação do token em `/curadores/eu`;
- manter o token em `sessionStorage`;
- retirar `curador` do payload de decisão;
- usar `versao_id` retornado pela API;
- usar `preview_url` no iframe.

### 5. Rankings
- exigir seleção de jogo no ranking de jogadores;
- consultar somente a rota oficial por jogo;
- manter ranking de jogos como apresentação dos valores oficiais devolvidos.

### 6. Anonimização
- exigir token de curador;
- enviar o jogo selecionado quando a ação partir do ranking de um jogo;
- atualizar a lista após a operação.

### 7. Mock
- manter o Mock API;
- atualizar o mock para aceitar o novo payload de submissão;
- reproduzir autenticação de curador local com `dev-curador` apenas para testes locais;
- manter placares como fronteira de teste G3 → G1, sem criar dependência G2 → G3.

### 8. Documentação
- atualizar arquitetura, integração e guia de execução;
- registrar a API oficial como fonte de produção;
- documentar o modo mock/local;
- registrar limitações dos testes realizados no ambiente disponível.

## Prognóstico de validação

A validação final deve ocorrer em duas camadas:

1. **Build local:** `npm install` e `npm run build`.
2. **Integração real:** catálogo, detalhes, submissão, autenticação de curador, curadoria, rankings e anonimização contra a API do G1.

Se algum fluxo exigir token real, ele deve ser testado somente com um token fornecido de forma privada e nunca commitado.
