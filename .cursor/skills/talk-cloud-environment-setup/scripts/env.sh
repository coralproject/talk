#!/usr/bin/env bash
# Source this file (do not execute it) to select the CI toolchain for Coral:
# Node 24.22.2 and pnpm 8.14.3 (see .github/workflows/build-and-test.yml).
#
#   . .cursor/skills/talk-cloud-environment-setup/scripts/env.sh

TALK_NODE_VERSION="${TALK_NODE_VERSION:-24.22.2}"
TALK_PNPM_VERSION="${TALK_PNPM_VERSION:-8.14.3}"
TALK_ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../../../.." && pwd)"
export TALK_ROOT TALK_NODE_VERSION TALK_PNPM_VERSION

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "nvm not found at $NVM_DIR/nvm.sh" >&2
  return 1
fi
# shellcheck source=/dev/null
. "$NVM_DIR/nvm.sh"

if ! nvm use "$TALK_NODE_VERSION" >/dev/null 2>&1; then
  nvm install "$TALK_NODE_VERSION" >/dev/null || return 1
  nvm use "$TALK_NODE_VERSION" >/dev/null || return 1
fi

# Agent shells can have another `node` (e.g. /exec-daemon/node) ahead of nvm on
# PATH. `nvm use` edits its entry in place, so native addons (re2) would then
# compile against the wrong Node ABI during `pnpm install`.
export PATH="$NVM_BIN:$PATH"

if [ "$(pnpm --version 2>/dev/null)" != "$TALK_PNPM_VERSION" ]; then
  corepack enable >/dev/null 2>&1 || true
  COREPACK_ENABLE_DOWNLOAD_PROMPT=0 corepack prepare "pnpm@$TALK_PNPM_VERSION" --activate >/dev/null || return 1
fi

export NPM_CONFIG_YES=true
