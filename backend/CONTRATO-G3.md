# Contrato de integração com o Fliperama local

O material de estudo do fliperama descreve o servidor local como ponte entre React, arquivos locais e a API externa. Ele expõe `/health`, `/jogos`, `/sincronizar` e `/resultados` localmente e envia resultados pendentes para `/api/resultados` da API externa. fileciteturn0file0L47-L68 fileciteturn0file0L202-L216

## Catálogo

`GET /api/jogos?status=aprovado`

Retorna objetos com pelo menos:

```json
{
  "id": 1,
  "nome": "Aventura Épica",
  "titulo": "Aventura Épica",
  "autores": ["Pedro Paglioni"],
  "autor": "Pedro Paglioni",
  "status": "aprovado",
  "caminho": "/jogos/1/index.html"
}
```

## Resultado do fliperama

`POST /api/resultados`

```json
{
  "id": "uuid-do-resultado",
  "matricula": "123456789012",
  "apelido": "JogadorXYZ",
  "jogoId": 1,
  "pontuacao": 15000,
  "avaliacao": 9
}
```

O campo `id` é usado para idempotência. Se o mesmo resultado for reenviado pela fila offline, o backend não duplica a pontuação.

O estudo fornecido define exatamente essa estrutura de `ResultadoPartida`. fileciteturn0file0L245-L254

## PostMessage do jogo

Isso não é enviado diretamente ao G2. O jogo roda no iframe do fliperama e manda ao React local:

```js
window.parent.postMessage({ tipo: 'PLACAR', pontos: 100 }, '*');
```

O servidor local transforma o resultado em `ResultadoPartida` e somente então envia para a API. fileciteturn0file0L176-L189
