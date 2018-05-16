const typeDefs = require('./server/typeDefs');
const resolvers = require('./server/resolvers');
const mutators = require('./server/mutators');
const path = require('path');

module.exports = {
  translations: path.join(__dirname, 'translations.yml'),
  typeDefs,
  mutators,
  resolvers,
};
