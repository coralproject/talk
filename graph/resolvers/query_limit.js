const { GraphQLInputInt } = require('graphql-input-number');
const { QUERY_MAX_LIMIT } = require('../../config');

module.exports = GraphQLInputInt({
  name: 'QueryLimit',
  description: 'QueryLimit sets the valid range for limits in queries',
  min: 1,
  max: QUERY_MAX_LIMIT,
});
