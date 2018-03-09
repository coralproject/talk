const path = require('path');
const translations = path.join(__dirname, 'translations.yml');

const connect = require('./connect');
const hooks = require('./hooks');
const mutators = require('./mutators');
const resolvers = require('./resolvers');
const router = require('./router');
const typeDefs = require('./typeDefs');

module.exports = {
  connect,
  hooks,
  mutators,
  resolvers,
  router,
  translations,
  typeDefs,
};
