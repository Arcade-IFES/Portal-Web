# Testes da API no Portal G2

## Mock local

Suba o projeto:

```bash
npm run dev
```

Mock API:

```text
http://localhost:3000
```

## Saúde / catálogo

```bash
curl http://localhost:3000/api/jogos
```

## Submissão

```bash
curl -X POST http://localhost:3000/api/jogos \
  -H "Content-Type: application/json" \
  -d '{
    "repositorio_url":"https://github.com/Arcade-IFES/jogo-exemplo",
    "ref":"v1.0.0",
    "resumo":"Submissão de teste"
  }'
```

No mock, os metadados do jogo são simulados. A ingestão real do repositório e a leitura do `game.json` são responsabilidades da API do G1.

## Curador local

O mock usa o token artificial:

```text
dev-curador
```

Validar:

```bash
curl http://localhost:3000/api/curadores/eu \
  -H "Authorization: Bearer dev-curador"
```

## Fila de curadoria

```bash
curl "http://localhost:3000/api/jogos?status=submetido"
```

## Decisão local

Substitua `<VERSAO_ID>` por um `versao_id` retornado pela submissão/fila:

```bash
curl -X POST "http://localhost:3000/api/versoes/<VERSAO_ID>/decisao" \
  -H "Authorization: Bearer dev-curador" \
  -H "Content-Type: application/json" \
  -d '{
    "decisao":"aprovado",
    "justificativa":"Jogo validado"
  }'
```

## Ranking de jogadores

O contrato atual exige jogo:

```bash
curl "http://localhost:3000/api/ranking/jogadores?jogo=jogo-exemplo"
```

## Ranking de jogos

```bash
curl http://localhost:3000/api/ranking/jogos
```

## Anonimização local

```bash
curl -X POST http://localhost:3000/api/ranking/jogadores/anonimizar \
  -H "Authorization: Bearer dev-curador" \
  -H "Content-Type: application/json" \
  -d '{
    "apelido":"ANA",
    "jogo":"jogo-exemplo"
  }'
```

## API oficial G1

Para integração real, configure:

```env
VITE_API_BASE_URL=https://plataforma-gestao-api.onrender.com/api
```

Os mesmos fluxos devem ser validados contra a API oficial, com um token de curador real para as operações autenticadas.
