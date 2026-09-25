# Arquitetura — Portal Web G2

## Papel do G2

O G2 implementa a interface web da Plataforma de Gestão:

- catálogo público de jogos aprovados;
- detalhe do jogo;
- submissão de jogos;
- fila/painel de curadoria;
- ranking de jogadores por jogo;
- ranking de jogos;
- exibição do feedback recebido;
- exibição de tema, nível, clássico de referência e taxa de acerto por tema.

A API, persistência, ingestão, placares e cálculos oficiais pertencem ao G1.

## Fronteira entre os grupos

```text
                    G4
             Jogos + Contratos
                    │
                    │ jogos / SDK / contratos
                    ▼
        ┌───────────────────────────┐
        │       G1 — API            │
        │                           │
        │ persistência oficial      │
        │ validação/curadoria       │
        │ catálogo                  │
        │ placares + votos          │
        │ rankings                  │
        └─────────────┬─────────────┘
                      │
              HTTP / JSON
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
   G2 — Portal                G3 — Fliperama
   catálogo                  sincronização
   submissão                 execução
   curadoria                 captura
   rankings                  fila/reenvio
```

## API oficial consumida pelo G2

Base atual:

```text
https://plataforma-gestao-api.onrender.com/api
```

O contrato oficial do G1 documenta, entre outras, estas rotas:

- `GET /api/jogos` — catálogo aprovado por padrão;
- `GET /api/jogos?status=submetido` — fila de curadoria;
- `GET /api/jogos/{id}` — detalhes;
- `POST /api/jogos` — submissão por repositório + tag;
- `GET /api/curadores/eu` — validação do curador;
- `POST /api/versoes/{versao_id}/decisao` — decisão autenticada;
- `GET /api/ranking/jogadores?jogo={id}` — ranking por jogo;
- `GET /api/ranking/jogos` — ranking de jogos;
- `POST /api/ranking/jogadores/anonimizar` — anonimização autenticada.

O G1 informa que submissão, catálogo e rankings não exigem token; curadoria e anonimização exigem token de curador.

## Submissão

O Portal envia:

```json
{
  "repositorio_url": "https://github.com/usuario/jogo",
  "ref": "v1.0.0",
  "resumo": "Resumo opcional"
}
```

Nome, autores, descrição, controles e demais metadados são extraídos pelo G1 do `game.json`.

## Curadoria

O Portal consulta a fila pública e usa `preview_url` em iframe. A decisão recebe `Authorization: Bearer cur_...` e somente `decisao`/`justificativa` no corpo. `curador` no corpo é ignorado pelo G1.

## Rankings

O Portal não calcula rankings oficiais.

O ranking de jogadores é sempre por jogo. Não existe ranking geral somando jogos.

O ranking de jogos também é calculado pelo G1; o Portal apenas apresenta os valores retornados.

## O que o G2 NÃO faz

- não mantém o banco oficial;
- não calcula rankings oficiais;
- não ingere placares do fliperama como autoridade;
- não sincroniza jogos para a máquina do pátio;
- não executa jogos em produção;
- não implementa autenticação própria para substituir a do G1;
- não decide contratos sozinho.

## Mock de integração

`mock-api/` existe apenas para desenvolvimento local.

Ele reproduz o contrato principal necessário pelo Portal, incluindo o novo fluxo de submissão e uma autenticação artificial de curador (`dev-curador`). O mock não baixa repositórios nem valida `game.json`; essas são responsabilidades da API oficial.

O endpoint local de placares continua existindo apenas para reproduzir testes da fronteira G3 → G1. O G2 não depende dele em produção.

## Produção

Configure o build do frontend com:

```env
VITE_API_BASE_URL=https://plataforma-gestao-api.onrender.com/api
```

O frontend passa a consumir diretamente a API oficial do G1.
