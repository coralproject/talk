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

# set working directory here within `scripts`
cd "$(dirname "$0")"

echo "running \`pnpm install\` for sub-directories"

sh pnpm-i.sh

echo "running generation steps for sub-directories"

sh generate.sh

echo "running a build to generate client manifests, common libs, and server worker.js assets"

sh build-development.sh

echo "initialization script finished"