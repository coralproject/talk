#!/bin/bash
set -e

cd "$(dirname "$0")"
cd ..

echo "linting \`client\`"

cd client
npm run lint
cd ..

echo "linting \`server\`"

cd server
npm run lint
cd ..

echo "linting \`docs\`"

cd docs
npm run lint
cd ..