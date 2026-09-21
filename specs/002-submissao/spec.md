# Feature 002 — Submissão por repositório GitHub

## Contexto

O professor confirmou uma alteração do fluxo: o autor não envia mais um ZIP pelo Portal; ele informa a URL do repositório GitHub.

## Requisitos

- O formulário recebe nome, versão, descrição, resumo, autores, controles e URL GitHub.
- O Portal valida apenas o formato básico da URL antes de enviar.
- O Portal envia os dados para a API.
- O Portal não clona o repositório.
- O Portal não decide se o jogo é válido.
- O resultado da API é mostrado ao usuário.
