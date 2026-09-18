# Backend G2 — Recreio Arcade

Backend do Portal de Gestão do Grupo 2, feito em Node.js + Fastify + TypeScript. A persistência de protótipo usa JSON local para não criar dependência de banco neste estágio.

## Contratos atendidos

### Portal G2
- GET `/health`
- GET `/api/jogos?status=aprovado`
- GET `/api/jogos/:id`
- GET `/api/moderacao?status=submetido`
- POST `/api/jogos/upload`
- POST `/api/jogos/:id/decisao`
- GET `/api/ranking/jogadores`
- GET `/api/ranking/jogos`
- POST `/api/jogos/:id/placar`
- POST `/api/jogos/:id/feedback`

### Compatibilidade com o Fliperama local (G3)
O estudo fornecido descreve o fliperama local como React/TypeScript/Vite + servidor Fastify. O servidor local consulta um catálogo e reenvia resultados para uma API externa. Este backend oferece:

- GET `/api/jogos` e GET `/jogos` para sincronização do catálogo;
- POST `/api/resultados` e POST `/resultados` para receber `ResultadoPartida`;
- idempotência por `id` do resultado;
- campos compatíveis com `matricula`, `apelido`, `jogoId`, `pontuacao` e `avaliacao`.

O documento de estudo também indica que o servidor do fliperama usa `API_G1` e, por padrão, aponta para `http://localhost:4000`, enviando resultados para `/api/resultados`. Portanto, para um teste conjunto local, configure o `API_G1` do G3 para a URL deste backend se o objetivo for simular o destino final. fileciteturn0file0L262-L279

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

API: `http://localhost:3000`

## Build

```bash
npm run build
npm start
```

## Testes rápidos

```bash
curl http://localhost:3000/health
curl "http://localhost:3000/api/jogos?status=aprovado"
curl http://localhost:3000/api/ranking/jogadores
curl http://localhost:3000/api/ranking/jogos
```

Resultado do G3:

```bash
curl -X POST http://localhost:3000/api/resultados \
  -H "Content-Type: application/json" \
  -d '{"id":"teste-001","matricula":"123456789012","apelido":"Eliabe","jogoId":1,"pontuacao":1500,"avaliacao":9}'
```

Envio de placar pelo contrato do Portal:

```bash
curl -X POST http://localhost:3000/api/jogos/1/placar \
  -H "Content-Type: application/json" \
  -d '{"apelido":"Eliabe","pontos":1500,"data_hora":"2026-09-16T17:00:00Z"}'
```

Feedback:

```bash
curl -X POST http://localhost:3000/api/jogos/1/feedback \
  -H "Content-Type: application/json" \
  -d '{"apelido":"Eliabe","nota":10,"comentario_opcional":"Excelente"}'
```

## Observação importante

O PDF de estudo informa que o fliperama local atualmente usa um mock para sincronização de jogos e que a integração real com a API externa ainda é um ponto de substituição futura. Por isso, este backend implementa o contrato de integração sem assumir detalhes que o material não documenta. fileciteturn0file0L217-L226
