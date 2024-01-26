#!/bin/bash
set -e

cd "$(dirname "$0")"
cd ..

echo "linting \`client\`"

cd client
pnpm run lint
cd ..

echo "linting \`server\`"

cd server
pnpm run lint
cd ..

echo "linting \`docs\`"

cd docs
pnpm run lint
cd ..