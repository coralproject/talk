#!/usr/bin/env bash
# Run a command from the talk repo root with the CI toolchain selected.
#
#   run.sh sh scripts/lint.sh
#   run.sh bash -c 'cd server && pnpm run test:server -- --ci'
set -euo pipefail

# shellcheck source=env.sh
. "$(dirname -- "${BASH_SOURCE[0]}")/env.sh"
cd "$TALK_ROOT"
exec "$@"
