# Feature 004 — Integração entre grupos

## Regra

O G2 não é o servidor do fliperama. G3 envia partidas para a API da plataforma; G2 recebe do mesmo serviço os dados já persistidos e agregados que precisa apresentar.

## Requisitos do Portal

- Consumir catálogo fornecido pela API.
- Consumir ranking de jogadores geral e por jogo.
- Consumir ranking de jogos.
- Consumir feedback agregado/detalhes do jogo.
- Não guardar matrícula.
- Não recalcular ranking oficial.

## Teste de mock

O mock deste repositório possui `POST /api/placares` somente para simular o tráfego G3 → API durante desenvolvimento. Isso não cria uma responsabilidade de produção para G2.
