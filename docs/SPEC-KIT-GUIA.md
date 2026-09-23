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

## 6. Diagnóstico e prognóstico do projeto

O Spec-Kit do G2 também deve registrar problemas encontrados durante a validação e as ações previstas para evitar que eles voltem a aparecer.

### Diagnóstico

O diagnóstico descreve o estado observado e deve diferenciar:

- erro reproduzido em execução;
- erro encontrado pela checagem de tipos/build;
- código morto ou duplicado;
- limitação de ambiente de teste;
- divergência de contrato entre grupos.

Para este ciclo, o diagnóstico registrado em `specs/005-hardening/spec.md` identificou:

- saída incorreta do TypeScript sem `rootDir`;
- conflito de `sendFile` ao registrar `@fastify/static` duas vezes;
- tipo `unknown` em `req.body` na rota de compatibilidade `/api/resultados`;
- pasta `api/` órfã;
- necessidade de formatação para leitura e revisão humana.

### Prognóstico

O prognóstico descreve as ações que devem ser verificadas depois das correções. Ele não deve tratar uma verificação não executada como concluída.

Neste ciclo, o plano é:

1. compilar o projeto com as dependências instaladas;
2. iniciar o mock com `web/dist` presente;
3. executar os testes reproduzíveis da API;
4. validar o deploy de demonstração;
5. confirmar, antes da integração real, os contratos publicados pelo G1.

As tarefas de verificação ficam em `specs/005-hardening/tasks.md`.
