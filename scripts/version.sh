#!/bin/bash
set -e

cd "$(dirname "$0")"
cd ..

echo "setting version to: $1"

echo "setting client version..."
cd client
npm version $1
cd ..

echo "setting common version..."
cd common
npm version $1
cd ..

echo "setting config version..."
cd config
npm version $1
cd ..

echo "setting server version..."
cd server
npm version $1
cd ..