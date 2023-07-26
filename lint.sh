#!/bin/bash
set -e

echo "linting \`client\`"

cd client
npm run lint
cd ..

echo "linting \`server\`"

cd server
npm run lint
cd ..