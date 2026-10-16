#!/usr/bin/env bash
# Gera o ContentFlow.app para macOS (rodar em um Mac). Uso: ./scripts/build-mac.sh
set -euo pipefail
cd "$(dirname "$0")/.."

command -v node >/dev/null || {
  echo "Node 26 não encontrado. Instale: brew install node@26 ou nvm install 26"
  exit 1
}
[ "$(node -p 'process.versions.node.split(".")[0]')" = "26" ] || {
  echo "Precisa de Node 26 (atual: $(node -v)). Ex.: nvm install 26 && nvm use 26"
  exit 1
}
command -v yarn >/dev/null || {
  echo "Yarn não encontrado. Instale: npm install -g yarn"
  exit 1
}

yarn install
yarn desktop:mac

APP=$(ls -d release/v1/mac*/ContentFlow.app | head -1)
xattr -cr "$APP" || true
echo "Pronto: $APP"
open -R "$APP"
