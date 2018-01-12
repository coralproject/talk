const { GraphQLObjectType, GraphQLInterfaceType } = require('graphql');

/**
 * Iterates over each field in a schema.
 * This function is pretty much copied verbatim from the graphql-tools repo:
 * https://github.com/apollographql/graphql-tools/blob/b12973c86e00be209d04af0184780998056051c4/src/schemaGenerator.ts#L180-L194
 * With the small alteration that we look for the `resolveType` function on the
 * schema so we can wrap post hooks around it to provide additional resolve
 * points. (Only when `options.includeResolveType` is set to true).
 *
 * @param  {GraphQLSchema} schema                       the schema to iterate over
 * @param  {function}      fn                           callback to call on each field
 * @param  {object}        [options]                    options
 * @param  {boolean}       [options.includeResolveType] include resolveType during iteration
 * @return {void}
 */
const forEachField = (schema, fn, options = {}) => {
  const { includeResolveType = false } = options;

  const typeMap = schema.getTypeMap();
  Object.keys(typeMap).forEach(typeName => {
    const type = typeMap[typeName];

    if (
      type instanceof GraphQLObjectType ||
      type instanceof GraphQLInterfaceType
    ) {
      // Here we capture the change to extract the resolve type. We pass this
      // with the `isResolveType = true` to introduce the specific beheviour.
      if (includeResolveType && 'resolveType' in type) {
        fn(type, typeName, '__resolveType', true);
      }

      const fields = type.getFields();
      Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        fn(field, typeName, fieldName);
      });
    }
  });
};

module.exports = {
  forEachField,
};
