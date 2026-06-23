#!/bin/bash
set -e

cd "$(dirname "$0")"
cd ..

echo "pruning --prod for server"
cd server
pnpm prune --prod
cd ..

echo "pruning --prod for \`config\`"
cd config
pnpm prune --prod
cd ..

echo "pruning --prod for \`client\`"
cd client
pnpm prune --prod
cd ..

echo "pruning --prod at root"
pnpm prune --prod
cd ..

