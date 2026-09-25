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
- submissão por URL de repositório GitHub + tag;
- fila e painel de curadoria;
- ranking de jogadores por jogo;
- ranking de jogos;
- exibição de feedback e taxa de acerto por tema.

O G2 não é responsável pelo banco oficial, cálculo oficial dos rankings, sincronização do fliperama ou captura de placares.

## API oficial do G1

Base atual:

```text
https://plataforma-gestao-api.onrender.com/api
```

Para produção, defina:

```env
VITE_API_BASE_URL=https://plataforma-gestao-api.onrender.com/api
```

O contrato oficial está documentado no repositório do G1 e deve ser tratado como fonte de verdade para a integração.

## Desenvolvimento local

```bash
npm install
npm install --prefix web
npm install --prefix mock-api
npm run dev
```

Portal: http://localhost:5173

Mock API: http://localhost:3000

Se `VITE_API_BASE_URL` estiver vazio, o frontend usa o proxy do Vite para o Mock API.

## Mock

`mock-api/` existe somente para desenvolvimento e testes antes ou fora da API oficial.

O mock reproduz o contrato principal do G1 para catálogo, detalhes, submissão, autenticação/curadoria, rankings e anonimização. O token local de curador é `dev-curador`.

O mock não substitui a validação/ingestão real do G1 e não é fonte oficial de dados.

## Documentação

- `docs/ARQUITETURA.md` — fronteiras entre grupos e API oficial.
- `docs/INTEGRACAO-G1-G3.md` — contratos e responsabilidades.
- `docs/TESTES-API.md` — testes locais.
- `docs/DEPLOY.md` — deploy e variáveis de ambiente.
- `docs/SPEC-KIT-GUIA.md` — como usar Spec-Kit no G2.
- `.specify/memory/constitution.md` — princípios do repositório.

## Spec-Kit

O repositório mantém specs incrementais. A feature `specs/006-integracao-api-g1/` registra o diagnóstico, plano e tarefas da migração do Mock API para a API oficial do G1.
