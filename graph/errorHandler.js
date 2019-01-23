const { forEachField } = require('./utils');
const { maskErrors } = require('graphql-errors');
const { TalkError } = require('../errors');
const {
  Error: { ValidationError },
} = require('mongoose');

// If an APIError happens in a mutation, then respond with `{errors: Array}`
// according to the schema.
const decorateWithMutationErrorHandler = field => {
  const fieldResolver = field.resolve;
  field.resolve = async (obj, args, ctx, info) => {
    try {
      return await fieldResolver(obj, args, ctx, info);
    } catch (err) {
      if (err instanceof TalkError) {
        return {
          errors: [err],
        };
      } else if (err instanceof ValidationError) {
        // TODO: wrap this with one of our internal errors.
        throw err;
      }

      throw err;
    }
  };
};

/**
 * Masks errors during production and handle mutation errors inside the schema.
 * @param  {GraphQLSchema} schema the schema to decorate
 * @return {void}
 */
const decorateWithErrorHandler = schema => {
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
