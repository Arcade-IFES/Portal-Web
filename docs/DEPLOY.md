# Deploy para teste online

## Opção preparada: Render

O `render.yaml` cria um único Web Service de demonstração. Ele sobe o mock Fastify e serve o build do React.

### Build

```bash
npm install && npm install --prefix web && npm install --prefix mock-api && npm run build
```

### Start

```bash
npm start
```

Depois do deploy:

- `/` → Portal React
- `/health` → health da API mock
- `/api/jogos?status=aprovado` → catálogo mock

### Importante

Esse deploy é para testar o G2 enquanto G1 ainda não está disponível. Não trate `mock-api` como API oficial da plataforma.

Quando G1 publicar a API, crie o build do frontend com:

```env
VITE_API_BASE_URL=https://api-oficial.exemplo/api
```

e faça o deploy do frontend sem depender do mock.

### Persistência

O `mock-api/data/db.json` é somente uma persistência de desenvolvimento. O banco oficial da plataforma não pertence ao G2.
