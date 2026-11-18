#!/usr/bin/env bash
# Frozen-lockfile install of every package, matching scripts/pnpm-ci.sh but
# without installing the git pre-commit hook. Idempotent.
set -euo pipefail

# shellcheck source=env.sh
. "$(dirname -- "${BASH_SOURCE[0]}")/env.sh"
cd "$TALK_ROOT"

for pkg in config common client server docs; do
  echo "== pnpm install --frozen-lockfile ($pkg)"
  (cd "$pkg" && pnpm install --frozen-lockfile)
done
