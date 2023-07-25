echo "generating schema types for client, common"

cd server
npm run generate
cd ..

echo "running \`npm run build\` for \`common\`"
cd common
npm run build
cd ..

echo "running \`npm run build\` for \`client\`"
cd client
npm run generate
cd ..
