# Integração G2 ↔ Fliperama local (G3)

## O que foi implementado

O backend do G2 foi criado em **Node.js + Fastify + TypeScript** e conversa com o protótipo web enviado pelo grupo. O frontend original foi preservado para não alterar o visual do protótipo; seus arquivos JS passaram a consultar o backend em vez de depender apenas dos mocks.

O material de estudo fornecido descreve a separação entre o frontend React/Vite, o servidor local Fastify e a API externa, além dos contratos `/health`, `/jogos`, `/sincronizar` e `/resultados`. fileciteturn0file0L47-L68

## Fluxo esperado

```text
PORTAL G2 (web)
   |
   | GET /api/jogos
   | POST /api/jogos/upload
   | POST /api/jogos/:id/decisao
   | GET /api/ranking/*
   | POST /api/jogos/:id/feedback
   v
BACKEND G2 / API
   |
   | GET /api/jogos
   | POST /api/resultados
   v
SERVIDOR LOCAL DO FLIPERAMA (G3)
   |
   | executa jogo em iframe
   | recebe PLACAR via postMessage
   | guarda fila offline
   v
API G2/G1
```

O estudo do fliperama confirma que o jogo roda em iframe e envia a pontuação ao React por `postMessage` com `{ tipo: 'PLACAR', pontos: ... }`. fileciteturn0file0L170-L189

## Compatibilidade com resultados

O servidor local do fliperama cria `ResultadoPartida` com:

```ts
{
  id: string;
  matricula: string;
  apelido: string;
  jogoId: number;
  pontuacao: number;
  avaliacao: number;
}
```

O backend G2 aceita exatamente esse formato em `POST /api/resultados`. O estudo também diz que o reenvio para a API externa deve ocorrer em `/api/resultados` e que a fila só deve remover o item depois de uma resposta de sucesso. fileciteturn0file0L245-L279

## Teste conjunto

### 1. G2

```bash
cd backend
npm install
npm run dev
```

API: `http://localhost:3000`

### 2. Front do G2

Como o arquivo entregue é HTML/CSS/JS, sirva a pasta com qualquer servidor estático. Exemplo:

```bash
cd recreio-arcade
npx serve . -l 5173
```

Abra:

`http://localhost:5173/index.html`

O frontend chama `http://localhost:3000/api`.

### 3. Teste do G3

No servidor local do fliperama, configure:

```env
API_G1=http://localhost:3000
```

O documento de estudo informa que o padrão do projeto é `API_G1=http://localhost:4000` e que o envio ocorre para `/api/resultados`. fileciteturn0file0L262-L269

Depois execute o G3 conforme o README dele. O teste de integração é:

```bash
curl http://localhost:3000/api/jogos
```

E:

```bash
curl -X POST http://localhost:3000/api/resultados \
  -H "Content-Type: application/json" \
  -d '{"id":"integracao-001","matricula":"123456789012","apelido":"Eliabe","jogoId":1,"pontuacao":2500,"avaliacao":9}'
```

Depois:

```bash
curl http://localhost:3000/api/ranking/jogadores
```

O jogador enviado deve aparecer no ranking.

## Teste do upload

O ZIP deve ter:

```text
jogo.zip
├── index.html
└── game.json
```

A API valida ZIP, limite de 20 MB, `index.html` na raiz e `game.json` na raiz. Isso corresponde ao contrato de empacotamento definido no projeto.
