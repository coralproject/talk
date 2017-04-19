const {readFileSync} = require('fs');
const path = require('path');

module.exports = {
  typeDefs: readFileSync(path.join(__dirname, 'server/typeDefs.graphql'), 'utf8')
};
