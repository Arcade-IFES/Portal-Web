#!/usr/bin/env bash
set -e
BASE="${BASE:-http://localhost:3000}"
echo '1) health'; curl -fsS "$BASE/health"; echo
echo '2) catalogo'; curl -fsS "$BASE/api/jogos?status=aprovado"; echo
echo '3) ranking jogadores'; curl -fsS "$BASE/api/ranking/jogadores"; echo
echo '4) ranking jogos'; curl -fsS "$BASE/api/ranking/jogos"; echo
echo '5) resultado G3'; curl -fsS -X POST "$BASE/api/resultados" -H 'Content-Type: application/json' -d '{"id":"cli-test-001","matricula":"123456789012","apelido":"Teste","jogoId":1,"pontuacao":1234,"avaliacao":9}'; echo
echo '6) ranking apos resultado'; curl -fsS "$BASE/api/ranking/jogadores"; echo
echo 'OK'
