#!/bin/bash
set -e

cd "$(dirname "$0")"
cd ..

echo "installing git hooks"

cd scripts
sh install-git-hooks.sh
cd ..

echo "running \`npm ci\` for \`config\`"
cd config
pnpm install --frozen-lockfile
cd ..

echo "running \`npm ci\` for \`common\`"
cd common
pnpm install --frozen-lockfile
cd ..

echo "running \`npm ci\` for \`client\`"
cd client
pnpm install --frozen-lockfile
cd ..

echo "running \`npm ci\` for \`server\`"
cd server
pnpm install --frozen-lockfile
cd ..

echo "running \`npm ci\` for \`docs\`"
cd docs
pnpm install --frozen-lockfile