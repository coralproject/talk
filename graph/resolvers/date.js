const GraphQLScalarType = require('graphql').GraphQLScalarType;
const Kind = require('graphql/language').Kind;

module.exports = new GraphQLScalarType({
  name: 'Date',
  description: 'Date represented as an ISO8601 string',
  serialize(value) {
    if (typeof value === 'string') {
      return value;
    }

    return value.toISOString();
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    switch (ast.kind) {
      case Kind.STRING:
        // This handles an empty string.
        if (ast.value && ast.value.length === 0) {
          return null;
        }

        return new Date(ast.value);
      default:
        return null;
    }
  },
});
