# Recreio Arcade — G2 Portal Web

Portal do Grupo 2 para a plataforma de gestão do Recreio Arcade.

## Stack

- React
- TypeScript
- Vite
- Node.js + Fastify (somente no mock de integração)
- React Router

A linguagem visual segue a plataforma local do G3: fundo escuro, tipografia monoespaciada, cyan/amarelo/magenta/verde neon, alto contraste e controles simples.

## Responsabilidade do G2

O G2 é responsável por:

- catálogo público;
- detalhe do jogo;
- submissão por URL de repositório GitHub (fluxo confirmado pelo professor);
- fila e painel de curadoria;
- ranking de jogadores;
- ranking de jogos;
- exibição de feedback e taxa de acerto por tema.

O G2 não é responsável pelo banco oficial, cálculo oficial dos rankings, sincronização do fliperama ou captura de placares.

## Desenvolvimento

```bash
npm install
npm install --prefix web
npm install --prefix mock-api
npm run dev
```

Portal: http://localhost:5173

Mock API: http://localhost:3000

## API oficial

Quando G1 publicar a API real, defina:

```env
VITE_API_BASE_URL=https://api-oficial.exemplo/api
```

O frontend então passa a consumir a API oficial sem precisar mudar as telas.

## Mock

`mock-api/` existe somente para permitir desenvolvimento e testes antes da API oficial. Ele implementa GET/POST para catálogo, submissão, curadoria e rankings e possui um endpoint de placares apenas para simular a fronteira G3 → API.

## Documentação

- `docs/ARQUITETURA.md` — fronteiras entre grupos.
- `docs/INTEGRACAO-G1-G3.md` — contratos e responsabilidades.
- `docs/TESTES-API.md` — testes GET/POST.
- `docs/DEPLOY.md` — deploy de demonstração.
- `docs/SPEC-KIT-GUIA.md` — como usar Spec-Kit no G2.
- `.specify/memory/constitution.md` — princípios do repositório.

## Spec-Kit

O material do professor mostra o uso de `specify init` por repositório e a sequência Constitution → Specify → Clarify → Plan → Tasks → Analyze → Implement. Este repositório já contém uma constitution e specs iniciais para o G2.
