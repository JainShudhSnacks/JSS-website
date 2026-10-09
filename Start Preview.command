#!/bin/zsh
set -e
JSS_PROJECT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
cd "$JSS_PROJECT_DIR"
JSS_NODE_PATH="$(command -v node || true)"
if [[ -z "$JSS_NODE_PATH" ]]; then
  JSS_NODE_PATH='/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
fi
if [[ ! -x "$JSS_NODE_PATH" ]]; then
  print 'Install Node.js 24 and pnpm, then follow README.md.'
  read 'JSS_ACK?Press Enter to close.'
  exit 1
fi
export PATH="$(dirname -- "$JSS_NODE_PATH"):$PATH"
if [[ ! -f node_modules/next/dist/bin/next ]]; then
  JSS_PNPM_PATH="$(command -v pnpm || true)"
  if [[ -z "$JSS_PNPM_PATH" ]]; then
    JSS_PNPM_PATH='/Users/admin/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm'
  fi
  "$JSS_PNPM_PATH" install --frozen-lockfile
fi
print 'JSS shop: http://127.0.0.1:3000'
print 'JSS admin: http://127.0.0.1:3000/admin'
print 'Keep this window open while reviewing. Press Control-C to stop.'
exec "$JSS_NODE_PATH" node_modules/next/dist/bin/next dev --hostname 127.0.0.1 --port 3000
