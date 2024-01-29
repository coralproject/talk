#!/bin/bash
set -e

cd "$(dirname "$0")"
cd ..

echo "generating schema types for client, common"

cd server
pnpm run generate
cd ..

echo "running \`pnpm run build\` for \`config\`"
cd config
pnpm run build
cd ..

echo "running \`pnpm run build\` for \`common\`"
cd common
pnpm run build
cd ..

echo "running \`pnpm run generate\` for \`client\`"
cd client
pnpm run generate
cd ..
