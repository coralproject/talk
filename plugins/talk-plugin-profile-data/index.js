const path = require('path');
const router = require('./server/router');
const mutators = require('./server/mutators');
const typeDefs = require('./server/typeDefs');
const connect = require('./server/connect');
const resolvers = require('./server/resolvers');

module.exports = {
  mutators,
  router,
  connect,
  typeDefs,
  translations: path.join(__dirname, 'translations.yml'),
  resolvers,
};
