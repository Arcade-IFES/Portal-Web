# Spec-Kit do Portal G2 — guia para a equipe

O material do professor usa Spec-Kit em repositórios separados. O exemplo `listaja-web` mostra o frontend React + Vite com uma constitution própria e specs próprias, enquanto a API possui outro fluxo. O princípio é o mesmo para o G2.

## 1. Instalar

Seguindo o exemplo publicado pelo professor:

```bash
uv --version
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

Depois, dentro do repositório do Portal:

```bash
specify init . --integration claude
```

Escolha a integração do agente que sua equipe realmente usa.

## 2. O que cada comando significa

- `/speckit.constitution` → princípios duráveis do repositório.
- `/speckit.specify` → o que a funcionalidade precisa fazer e por quê.
- `/speckit.clarify` → perguntas para remover ambiguidades.
- `/speckit.plan` → como construir tecnicamente.
- `/speckit.tasks` → quebra em tarefas executáveis.
- `/speckit.analyze` → procura inconsistências entre spec, plano e tarefas.
- `/speckit.checklist` → checklist de qualidade.
- `/speckit.implement` → implementação das tarefas.

## 3. Regra prática para o G2

Antes de pedir código para a IA:

```text
comportamento → spec
ambiguidade → clarify
tecnologia/arquitetura → plan
trabalho → tasks
código → implement
```

## 4. Features sugeridas

- `001-portal` — estrutura do Portal e navegação.
- `002-submissao` — envio por URL GitHub.
- `003-curadoria` — fila, preview e decisão.
- `004-integracao-g3` — fronteira de contratos e dados que o G2 recebe da API.

## 5. O que NÃO colocar na spec do G2

Não atribua ao G2:

- banco oficial;
- cálculo oficial de ranking;
- fila offline do fliperama;
- sincronização do catálogo no PC do pátio;
- SDK do jogo.

Esses itens pertencem a outras fronteiras do projeto.
