#!/bin/bash
set -e

echo "checking for \`homebrew\` for macOS"

which -s brew
if [[ $? != 0 ]] ; then
    echo "homebrew not found, installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "homebrew found, performing a quick \`brew update\`..."
    brew update
fi

echo "checking for \`watchman\` for macOS"

if brew ls --versions "watchman"; then
  echo "watchman is already installed"
else
  echo "watchman not found, installing..."
  brew install watchman
fi

echo "checking for correct node and npm versions"
targetNodeVer="v18.16.0"
# excluding the v here explicitly
targetNpmVer="8.0.0"

nodeVer=$(eval "node --version")
npmVer=$(eval "npm --version")

if [ "$nodeVer" = $targetNodeVer ]; then
  echo "node $nodeVer is installed"
else
  echo "incorrect node version $nodeVer detected, please install correct node version ($targetNodeVer)"
  exit 1
fi

if [ "$npmVer" = "$targetNpmVer" ]; then
  echo "nmp $npmVer is installed"
else
  echo "incorrect npm version $npmVer detected, please install correct npm version ($targetNpmVer)"
  exit 1
fi

echo "installing correct pnpm version globally (needed for git hooks)"
npm install -g pnpm@8.14.3

# set working directory here within `scripts`
cd "$(dirname "$0")"

echo "running \`pnpm install\` for sub-directories"

sh pnpm-i.sh

echo "running generation steps for sub-directories"

sh generate.sh

echo "running a build to generate client manifests, common libs, and server worker.js assets"

sh build-development.sh

echo "initialization script finished"