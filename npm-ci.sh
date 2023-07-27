#!/bin/bash
set -e

echo "running \`npm install\` for \`config\`"
cd config
npm ci
cd ..

echo "running \`npm install\` for \`common\`"
cd common
npm ci
cd ..

echo "running \`npm install\` for \`client\`"
cd client
npm ci
cd ..

echo "running \`npm install\` for \`server\`"
cd server
npm ci