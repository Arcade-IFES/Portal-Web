# Arquitetura — Portal Web G2

## Papel do G2

O G2 implementa a interface web da Plataforma de Gestão:

- catálogo público de jogos aprovados;
- detalhe do jogo;
- submissão de jogos;
- fila/painel de curadoria;
- ranking de jogadores geral e por jogo;
- ranking de jogos;
- exibição do feedback recebido do pátio;
- exibição de tema, nível, clássico de referência e taxa de acerto por tema.

Essas responsabilidades correspondem à divisão do trabalho publicada pelo professor. A especificação atribui ao G2 o portal público e o painel do curador, enquanto a API, persistência, ingestão de partidas e cálculo oficial dos rankings ficam na camada da plataforma de gestão. 

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

O contrato publicado pelo professor contém, entre outras, estas rotas:

- `GET /api/jogos?status=aprovado`
- `GET /api/jogos/{id}`
- `POST /api/jogos` — o fluxo atual do projeto foi alterado para receber URL de repositório GitHub, por decisão comunicada pelo professor;
- `POST /api/versoes/{id}/decisao`
- `GET /api/ranking/jogadores?jogo=`
- `GET /api/ranking/jogos`

O contrato publicado ainda mostra `.zip` no texto da especificação. Para este repositório, a decisão de usar URL GitHub é tratada como uma alteração de contrato já confirmada pela equipe/professor; o payload definitivo deve ser alinhado com G1.

## O que o G2 NÃO faz

- não mantém o banco oficial;
- não calcula o ranking oficial;
- não ingere placares do fliperama como autoridade;
- não sincroniza jogos para a máquina do pátio;
- não executa jogos em produção;
- não decide o contrato sozinho.

## Mock de integração

`mock-api/` existe apenas para permitir que o G2 seja desenvolvido e testado antes da API oficial ficar disponível.

O mock implementa os contratos necessários para testar:

- GET de catálogo;
- GET de detalhes;
- POST de submissão por URL GitHub;
- GET da fila de curadoria;
- POST de decisão;
- GET dos rankings;
- POST de anonimização;
- POST de placar apenas para reproduzir o tráfego de integração em testes.

O último item não transforma G2 no dono do fluxo de placares.

## Produção

Em produção, configure:

```env
VITE_API_BASE_URL=https://URL-DA-API-OFICIAL/api
```

O frontend deixa de falar com `mock-api` e passa a consumir G1.
