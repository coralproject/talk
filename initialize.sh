echo "installing \`homebrew\` for macOS"

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

echo "installing \`watchman\` for macOS"

brew update
brew install watchman

echo "running \`npm install\` for sub-directories"

sh npm-i.sh

echo "creating a \`client\` build to generate manifests"

cd client
npm run build:development

echo "initialization script finished"