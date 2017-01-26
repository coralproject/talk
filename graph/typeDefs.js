// TODO: Adjust `RootQuery.asset(id: ID, url: String)` to instead be
// `RootQuery.asset(id: ID, url: String!)` because we'll always need the url, if
// this change is done now everything will likely break on the front end.

const fs = require('fs');
const path = require('path');

// Load the typeDefs from the graphql file.
const typeDefs = fs.readFileSync(path.join(__dirname, 'typeDefs.graphql'), 'utf8');

module.exports = typeDefs;
