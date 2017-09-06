const {
  GraphQLObjectType,
  GraphQLInterfaceType
} = require('graphql');
const {maskErrors} = require('graphql-errors');
const errors = require('../errors');
const {Error: {ValidationError}} = require('mongoose');

// This function is pretty much copied verbatim from the graphql-tools repo:
// https://github.com/apollographql/graphql-tools/blob/b12973c86e00be209d04af0184780998056051c4/src/schemaGenerator.ts#L180-L194
const forEachField = (schema, fn) => {
  const typeMap = schema.getTypeMap();
  Object.keys(typeMap).forEach((typeName) => {
    const type = typeMap[typeName];

    if (type instanceof GraphQLObjectType || type instanceof GraphQLInterfaceType) {
      const fields = type.getFields();
      Object.keys(fields).forEach((fieldName) => {
        const field = fields[fieldName];
        fn(field, typeName, fieldName);
      });
    }
  });
};

// If an APIError happens in a mutation, then respond with `{errors: Array}`
// according to the schema.
const decorateWithMutationErrorHandler = (field) => {
  const fieldResolver = field.resolve;
  field.resolve = async (obj, args, ctx, info) => {
    try {
      return await fieldResolver(obj, args, ctx, info);
    }
    catch(err) {
      if (err instanceof errors.APIError) {
        return {
          errors: [err]
        };
      } else if (err instanceof ValidationError) {

        // TODO: wrap this with one of our internal errors.
        throw err;
      }

      throw err;
    }
  };
};

// Masks errors during production and handle mutation errors inside the schema.
const decorateWithErrorHandler = (schema) => {
  forEachField(schema, (field, typeName) => {

    // Handle mutation errors.
    if (typeName === 'RootMutation') {
      decorateWithMutationErrorHandler(field);
    }

    // If we are in production mode, don't show server errors to the front end.
    if (process.env.NODE_ENV === 'production') {

      // Mask errors that are thrown if we are in a production environment.
      maskErrors(field);
    }
  });
};

module.exports = {
  decorateWithErrorHandler,
};
