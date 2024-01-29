#!/bin/bash
set -e

cd "$(dirname "$0")"
cd ..

echo "installing git hooks"

cd scripts
sh install-git-hooks.sh
cd ..

echo "running \`pnpm install\` for \`config\`"
cd config
pnpm i
cd ..

echo "running \`pnpm install\` for \`common\`"
cd common
pnpm i
cd ..

echo "running \`pnpm install\` for \`client\`"
cd client
pnpm i
cd ..

echo "running \`pnpm install\` for \`server\`"
cd server
pnpm i
cd ..

echo "running \`pnpm install\` for \`docs\`"
cd docs
pnpm i