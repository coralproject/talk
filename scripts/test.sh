#!/bin/bash
set -e

cd "$(dirname "$0")"
cd ..

echo "running server side tests..."

cd server
npm run test:server -- --ci --reporters=default --reporters=jest-junit
cd ..

echo "running client side tests..."

cd client

echo "running stream tests..."
npm run test:client:stream -- --ci --reporters=default --reporters=jest-junit

echo "running admin tests..."
npm run test:client:admin -- --ci --reporters=default --reporters=jest-junit

echo "running other client tests..."
npm run test:client:other -- --ci --reporters=default --reporters=jest-junit

cd ..
