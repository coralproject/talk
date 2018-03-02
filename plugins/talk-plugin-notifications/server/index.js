const path = require('path');
const connect = require('./connect');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const router = require('./router');
const mutators = require('./mutators');
const translations = path.join(__dirname, 'translations.yml');

module.exports = {
  translations,
  typeDefs,
  resolvers,
  mutators,
  connect,
  router,
};
