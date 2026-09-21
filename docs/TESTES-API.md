# Testes da API de integração

## 1. Subir localmente

Terminal 1:

```bash
npm install
npm run dev:api
```

Terminal 2:

```bash
npm run dev:web
```

Portal: `http://localhost:5173`

Mock: `http://localhost:3000`

## 2. Health

```bash
curl http://localhost:3000/health
```

## 3. GET — catálogo

```bash
curl "http://localhost:3000/api/jogos?status=aprovado"
```

## 4. POST — submissão por GitHub

```bash
curl -X POST http://localhost:3000/api/jogos \
  -H "Content-Type: application/json" \
  -d '{
    "nome":"Jogo de Teste",
    "versao":"1.0.0",
    "descricao":"Descrição de teste",
    "resumo":"Resumo de teste",
    "autores":["Eliabe"],
    "controles":"Setas",
    "repositorio_url":"https://github.com/Arcade-IFES/jogo-demo"
  }'
```

Depois:

```bash
curl "http://localhost:3000/api/jogos?status=submetido"
```

## 5. POST — decisão de curadoria

Use o `id` da versão devolvida pelo POST anterior:

```bash
curl -X POST http://localhost:3000/api/versoes/demo-v1/decisao \
  -H "Content-Type: application/json" \
  -d '{
    "decisao":"aprovado",
    "justificativa":"Teste aprovado",
    "curador":"CURADOR"
  }'
```

## 6. GET — ranking

```bash
curl http://localhost:3000/api/ranking/jogadores
curl http://localhost:3000/api/ranking/jogos
```

## 7. POST — simular dado vindo do G3

Este endpoint existe somente no mock para provar a integração de dados:

```bash
curl -X POST http://localhost:3000/api/placares \
  -H "Content-Type: application/json" \
  -d '{
    "id_partida":"teste-001",
    "jogo_id":"orbita-do-saber",
    "jogador":"ELIABE",
    "pontos":1500,
    "duracao_s":120,
    "acertos":8,
    "erros":2,
    "tema":"Ciências"
  }'
```

Depois consulte o ranking.

## 8. O que esse teste prova

```text
POST/GET de integração
        ↓
mock de API
        ↓
Portal React
        ↓
renderização dos dados
```

Ele não prova a integração com G1 real. Para isso, `VITE_API_BASE_URL` deve apontar para a API oficial.
