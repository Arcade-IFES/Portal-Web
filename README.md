# Recreio Arcade — Grupo 2

Pacote integrado para desenvolvimento do Portal de Gestão do G2.

- `recreio-arcade/`: protótipo visual original enviado pelo grupo, agora consumindo a API quando ela está disponível.
- `backend/`: API REST em Node.js + Fastify + TypeScript.
- `INTEGRACAO.md`: fluxo de integração com o servidor local do fliperama.

## Ordem para executar

Terminal 1:

```bash
cd backend
npm install
npm run dev
```

Terminal 2:

```bash
cd recreio-arcade
npx serve . -l 5173
```

Abra `http://localhost:5173/index.html`.

A API fica em `http://localhost:3000`.
