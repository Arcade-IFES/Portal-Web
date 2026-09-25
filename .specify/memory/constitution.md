# Constitution — Portal Web G2 | Recreio Arcade

## 1. Fronteira de responsabilidade
- O G2 é responsável pela interface web da plataforma de gestão: catálogo, detalhes, submissão, painel de curadoria e visualização dos rankings/feedback.
- A API e a persistência oficiais pertencem ao G1.
- O Portal nunca deve criar uma segunda fonte oficial para jogos, partidas, votos ou rankings.
- O fliperama G3 é responsável pela sessão local, cache, execução, captura e fila de envio. O Portal G2 não assume essas responsabilidades.
- O G4 é responsável pelos jogos e pelos contratos necessários para executá-los.

## 2. Contrato oficial entre G2 e G1
- A fonte de produção do Portal é a API oficial do G1.
- Base atual da API: `https://plataforma-gestao-api.onrender.com/api`.
- O contrato deve ser seguido conforme a documentação oficial do G1.
- Submissões usam `repositorio_url`, `ref` e `resumo?`; os metadados do jogo vêm do `game.json`.
- Curadoria usa token `cur_...` no cabeçalho `Authorization: Bearer <token>`.
- O ranking de jogadores é exclusivamente por jogo.
- `capa_url` e `preview_url` fornecidos pela API são as fontes para imagem e preview.
- Erros oficiais seguem `{ "codigo": "...", "erro": "mensagem" }`.
- Mudança de contrato não deve ser feita unilateralmente pelo G2.

## 3. Stack
- Frontend: React + TypeScript + Vite.
- API de mock: Node.js + Fastify + TypeScript, somente para desenvolvimento/teste.
- O visual do Portal deve compartilhar a linguagem visual do Fliperama G3: fundo escuro, tipografia monoespaçada, cyan/amarelo/magenta/verde neon, alto contraste e componentes simples.

## 4. Dados e rankings
- O G2 não calcula ranking oficial.
- O G2 não recebe placares do G3 como responsabilidade de negócio.
- O G2 exibe rankings, feedbacks e agregados recebidos da API.
- O G2 não mantém banco oficial de jogos, partidas ou votos.
- O Portal não cria ranking geral de jogadores; a API oficial fornece ranking por jogo.

## 5. Autenticação
- Tokens de curador pertencem ao G1 e não devem ser fixados no código ou commitados.
- O Portal pode armazenar temporariamente um token informado pelo curador durante a sessão do navegador.
- O Portal não implementa autenticação própria para substituir a autenticação do G1.

## 6. Mock local
- Enquanto necessário, `mock-api/` reproduz o contrato relevante para desenvolvimento.
- O mock não é fonte oficial e não deve ser tratado como substituto do G1 em produção.
- O mock pode ter tokens e dados artificiais próprios para testes locais.

## 7. Qualidade
- Toda feature deve ter uma spec antes de ser implementada.
- Toda integração deve ter testes reproduzíveis quando aplicável.
- Erros de API devem ser apresentados de forma acionável ao usuário.
- O build TypeScript/Vite deve passar antes da entrega.
- Alterações de formatação devem preservar comportamento, contratos, mensagens e regras de negócio.
- Diagnósticos devem registrar problemas reproduzidos ou verificáveis; prognósticos devem registrar verificações futuras sem marcá-las como concluídas antes da execução.
