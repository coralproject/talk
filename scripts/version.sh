#!/bin/bash
set -e

cd "$(dirname "$0")"
cd ..

echo "setting version to: $1"

echo "setting client version..."
cd client
pnpm version $1
cd ..

echo "setting common version..."
cd common
pnpm version $1
cd ..

echo "setting config version..."
cd config
pnpm version $1
cd ..

echo "setting server version..."
cd server
pnpm version $1
cd ..