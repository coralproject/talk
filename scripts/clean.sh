cd "$(dirname "$0")"
cd ..

echo "clearing \`client/dist/\`..."
rm -r client/dist

echo "clearing \`server/dist/\`..."
rm -r server/dist

echo "clearing \`common/dist/\`..."
rm -r common/dist

echo "clearing \`config/dist/\`..."
rm -r config/dist

echo "clearing \`docs/.docusaurus/\`..."
rm -r docs/.docusaurus