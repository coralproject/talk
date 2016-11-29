node_modules/selenium-standalone/bin/selenium-standalone install
source .env-test
node tests/e2e/mocks &
npm start &
