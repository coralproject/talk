const GraphQLScalarType = require('graphql').GraphQLScalarType;
const Kind = require('graphql/language').Kind;

module.exports = new GraphQLScalarType({
  name: 'Cursor',
  description: 'Cursor represents a paginating cursor.',
  serialize(value) {
    if (value instanceof Date) {
      return value.toISOString();
    }

    return value;
  },
  parseValue(value) {
    if (typeof value === 'string') {
      return new Date(value);
    }

    return value;
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
        return ast.value;
    }
  },
});
