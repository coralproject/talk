#!/bin/bash
set -e

cd "$(dirname "$0")"
cd ..

echo "running \`npm ci\` for \`config\`"
cd config
npm ci
cd ..

echo "running \`npm ci\` for \`common\`"
cd common
npm ci
cd ..

echo "running \`npm ci\` for \`client\`"
cd client
npm ci
cd ..

echo "running \`npm ci\` for \`server\`"
cd server
npm ci
cd ..

echo "running \`npm ci\` for \`docs\`"
cd docs
npm ci