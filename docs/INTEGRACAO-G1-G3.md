# Integração do G2 com G1 e G3

## Regra principal

G2 não conversa diretamente com G3 para transportar partidas. O caminho de produção é:

```text
G3 → API oficial/G1 → dados persistidos e rankings → G2
```

O G2 consulta a API para exibir os dados.

## O que o G2 envia para G1

### Submissão de jogo

```http
POST /api/jogos
Content-Type: application/json
```

No fluxo atualmente adotado pelo projeto, o Portal envia a URL GitHub e os metadados informados pelo autor.

Exemplo usado pelo mock:

```json
{
  "nome": "Meu Jogo",
  "versao": "1.0.0",
  "descricao": "Descrição",
  "resumo": "Resumo",
  "autores": ["Autor"],
  "controles": "Setas + Espaço",
  "repositorio_url": "https://github.com/usuario/meu-jogo"
}
```

**Importante:** o nome definitivo do campo da URL deve ser confirmado no contrato compartilhado com G1.

### Decisão de curadoria

```http
POST /api/versoes/{id}/decisao
```

```json
{
  "decisao": "aprovado",
  "justificativa": "Jogo validado",
  "curador": "CURADOR"
}
```

## O que o G2 recebe

Catálogo:

```http
GET /api/jogos?status=aprovado
```

Detalhes:

```http
GET /api/jogos/{id}
```

Ranking de jogadores:

```http
GET /api/ranking/jogadores?jogo={id-opcional}
```

Ranking de jogos:

```http
GET /api/ranking/jogos
```

## O que G3 faz

O G3 é dono da plataforma local: sincroniza, mantém cache, executa o jogo, captura o placar e mantém fila de reenvio.

O código recebido do G3 neste trabalho possui uma implementação local que atualmente usa `/jogos`, `/sincronizar` e `/resultados`, além de uma variável `API_G1`. Isso é responsabilidade do G3 e não deve ser duplicado pelo G2.

Para a integração oficial, o contrato comum deve prevalecer. A especificação atual do trabalho define `POST /api/placares` para a ingestão de partidas. Se G3/G1 mantiverem temporariamente um alias como `/api/resultados`, ele deve ser tratado como compatibilidade transitória, não como responsabilidade do G2.
