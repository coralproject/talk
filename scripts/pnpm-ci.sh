#!/bin/bash
set -e

cd "$(dirname "$0")"
cd ..

echo "installing git hooks"

cd scripts
sh install-git-hooks.sh
cd ..

echo "running \`pnpm install --frozen-lockfile\` for \`config\`"
cd config
pnpm install --frozen-lockfile
cd ..

echo "running \`pnpm install --frozen-lockfile\` for \`common\`"
cd common
pnpm install --frozen-lockfile
cd ..

echo "running \`pnpm install --frozen-lockfile\` for \`client\`"
cd client
pnpm install --frozen-lockfile
cd ..

echo "running \`pnpm install --frozen-lockfile\` for \`server\`"
cd server
pnpm install --frozen-lockfile
cd ..

echo "running \`pnpm install --frozen-lockfile\` for \`docs\`"
cd docs
pnpm install --frozen-lockfile