# Tasks: Integração API G1

## Diagnóstico

- [x] Confirmar contrato oficial de integração do G1.
- [x] Identificar payload antigo de submissão no G2.
- [x] Identificar ausência de autenticação de curador no G2.
- [x] Identificar ranking geral de jogadores no G2.
- [x] Identificar consumo de `capa` em vez de `capa_url`.

## Implementação

- [x] Atualizar tipos da API oficial.
- [x] Centralizar token de curador em `web/src/api.ts`.
- [x] Implementar validação do curador.
- [x] Atualizar submissão para `repositorio_url`, `ref`, `resumo`.
- [x] Atualizar decisão de curadoria.
- [x] Atualizar preview e capa.
- [x] Remover ranking geral de jogadores da interface.
- [x] Atualizar anonimização para contrato autenticado.
- [x] Manter Mock API para desenvolvimento local.
- [x] Atualizar Mock API para o contrato de submissão e autenticação local.
- [x] Atualizar Spec-Kit e documentação.

## Validação prognóstica

- [ ] Executar `npm install` com acesso à rede.
- [ ] Executar `npm run build`.
- [ ] Executar o Portal local contra o Mock API.
- [ ] Consultar catálogo real do G1.
- [ ] Consultar detalhes reais do G1.
- [ ] Testar submissão real com repositório de jogo válido.
- [ ] Testar autenticação com token real de curador.
- [ ] Testar fila e preview de curadoria.
- [ ] Testar aprovação e reprovação.
- [ ] Testar ranking de jogadores por jogo.
- [ ] Testar ranking de jogos.
- [ ] Testar anonimização autenticada.
- [ ] Testar respostas 400/401/404/409/422.
- [ ] Validar deploy do Portal apontando para a API oficial.
