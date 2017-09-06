const {readFileSync} = require('fs');
const path = require('path');
const router = require('./server/router');
const hooks = require('./server/hooks');

module.exports = {
  typeDefs: readFileSync(path.join(__dirname, 'server/typeDefs.graphql'), 'utf8'),
  router,
  hooks,
};
