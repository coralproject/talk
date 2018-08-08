const { GraphQLInputInt } = require('graphql-input-number');
const { QUERY_MAX_LIMIT } = require('../../config');

module.exports = Limit = GraphQLInputInt({
  name: 'Limit',
  min: 1,
  max: QUERY_MAX_LIMIT
});
