# Integração do G2 com G1 e G3

## Regra principal

G2 não conversa diretamente com G3 para transportar partidas. O caminho de produção é:

```text
G3 → API oficial/G1 → dados persistidos e rankings → G2
```

O G2 consulta a API para exibir os dados.

## API oficial do G1

Base:

```text
https://plataforma-gestao-api.onrender.com/api
```

A documentação de integração do G1 informa que CORS está liberado para qualquer origem e que erros seguem `{ "codigo": "...", "erro": "mensagem" }`.

## O que o G2 envia para G1

### Submissão de jogo

```http
POST /api/jogos
Content-Type: application/json
```

```json
{
  "repositorio_url": "https://github.com/usuario/meu-jogo",
  "ref": "v1.0.0",
  "resumo": "Resumo opcional"
}
```

Nome, descrição, autores, controles e demais dados vêm do `game.json`; o formulário do Portal não precisa pedir esses campos.

### Decisão de curadoria

```http
POST /api/versoes/{versao_id}/decisao
Authorization: Bearer cur_...
Content-Type: application/json
```

```json
{
  "decisao": "aprovado",
  "justificativa": "Jogo validado"
}
```

Para reprovar, `justificativa` é obrigatória. O G1 determina o curador pelo token.

## O que o G2 recebe

Catálogo:

```http
GET /api/jogos
```

Detalhes:

```http
GET /api/jogos/{id}
```

Ranking de jogadores:

```http
GET /api/ranking/jogadores?jogo={id}
```

Ranking de jogos:

```http
GET /api/ranking/jogos
```

A API fornece `capa_url` e `preview_url` para consumo direto pelo Portal. Os detalhes também incluem `feedbacks` e `taxa_acerto_tema`.

## Autenticação do curador

O Portal valida o token com:

```http
GET /api/curadores/eu
Authorization: Bearer cur_...
```

A resposta documentada contém `id` e `nome`.

O token não deve ser commitado no repositório. No G2, ele é mantido apenas na sessão do navegador.

## Anonimização

A operação oficial é:

```http
POST /api/ranking/jogadores/anonimizar
Authorization: Bearer cur_...
Content-Type: application/json
```

```json
{
  "apelido": "ANA",
  "jogo": "jogo-exemplo"
}
```

O campo `jogo` é opcional na API; o Portal o informa quando a ação é realizada no ranking de um jogo específico.

## O que G3 faz

O G3 é dono da plataforma local: sincroniza, mantém cache, executa o jogo, captura o placar e mantém fila de reenvio.

O contrato oficial indica `POST /api/placares` com token de estação `est_...`. `/api/resultados` continua funcionando apenas como compatibilidade temporária. Isso não cria uma responsabilidade de placares para o G2.
