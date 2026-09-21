# Constitution — Portal Web G2 | Recreio Arcade

## 1. Fronteira de responsabilidade
- O G2 é responsável pela interface web da plataforma de gestão: catálogo, detalhes, submissão, painel de curadoria e visualização dos rankings/feedback.
- A API e a persistência oficiais pertencem ao grupo responsável pela plataforma de gestão/API (G1).
- O Portal nunca deve criar uma segunda fonte oficial para jogos, partidas, votos ou rankings.
- O fliperama G3 é responsável pela sessão local, cache, execução, captura e fila de envio. O Portal G2 não assume essas responsabilidades.

## 2. Contratos entre grupos
- O Portal consome contratos HTTP/JSON da API oficial.
- Mudança de contrato não é unilateral: deve ser comunicada aos grupos antes do código ser alterado.
- Enquanto a API oficial não existir, este repositório usa um mock de integração. O mock não deve ser tratado como API oficial.
- O fluxo de submissão adotado para este projeto é por URL de repositório GitHub, conforme decisão comunicada pelo professor. O nome exato do campo HTTP deve acompanhar o contrato compartilhado quando G1 publicá-lo.

## 3. Stack
- Frontend: React + TypeScript + Vite.
- API de mock: Node.js + Fastify + TypeScript, somente para desenvolvimento/teste.
- O visual do Portal deve compartilhar a linguagem visual do Fliperama G3: fundo escuro, tipografia monoespaçada, cyan/amarelo/magenta/verde neon, alto contraste e componentes simples.

## 4. Dados
- O G2 não calcula ranking oficial.
- O G2 não recebe placares do G3 como responsabilidade de negócio.
- O G2 exibe os rankings, feedbacks e agregados recebidos da API.
- O G2 não guarda matrícula ou outros dados pessoais. O contrato público do projeto usa apelido.

## 5. Qualidade
- Toda feature deve ter uma spec antes de ser implementada.
- Toda integração deve ter pelo menos um teste reproduzível de GET e POST quando aplicável.
- Erros de API devem ser apresentados de forma acionável ao usuário.
- O Portal deve funcionar com dados mockados sem depender da disponibilidade da API oficial.
