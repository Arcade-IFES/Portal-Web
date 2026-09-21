# Feature 003 — Curadoria

## Objetivo

Como curador, quero visualizar as submissões pendentes, abrir o preview disponível, aprovar ou reprovar e registrar justificativa na reprovação.

## Requisitos

- A fila mostra somente versões `submetido`.
- O preview usa a URL fornecida pela API quando disponível.
- Se não houver preview, o Portal informa a ausência e oferece o repositório.
- Aprovação e reprovação são enviadas para a API.
- Reprovação exige justificativa.
- O Portal não altera o estado localmente como fonte oficial; aguarda a resposta da API.
