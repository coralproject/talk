const { forEachField } = require('./utils');
const debug = require('debug')('talk:graph:schema');
const Joi = require('joi');

/**
 * XXX taken from graphql-js: src/execution/execute.js, because that function
 * is not exported
 *
 * If a resolve function is not given, then a default resolve behavior is used
 * which takes the property of the source object of the same name as the field
 * and returns it as the result, or if it's a function, returns the result
 * of calling that function.
 */
const defaultResolveFn = (source, args, context, { fieldName }) => {
  // ensure source is a value for which property access is acceptable.
  if (typeof source === 'object' || typeof source === 'function') {
    const property = source[fieldName];
    if (typeof property === 'function') {
      return source[fieldName](args, context);
    }
    return property;
  }
};

/**
 * Decorates the field with the post resolvers (if available) and attaches a
 * default type in the form of `Default${typeName}`.
 */
const decorateResolveFunction = (field, typeName, fieldName, post) => {
  // Cache the original resolverType function.
  let resolveType = field.resolveType;

  // defaultResolveType is the default type that is resolved on a resolver
  // when the interface being looked up is not defined.
  const defaultResolveType = `Default${typeName}`;

  // Return the function to handle the resolveType hooks.
  const defaultResolveFn = (obj, context, info) => {
    let type = resolveType(obj, context, info);

    // Only if a previous resolver was unable to resolve the field type do we
    // progress to the hooks (in order!) to resolve the field name until we
    // have resolved it.
    if (typeof type !== 'undefined' && type != null) {
      return type;
    }

    // All else fails, resort to the defaultResolveType.
    return defaultResolveType;
  };

  // This only needs to do something if post hooks are defined.
  if (post.length === 0) {
    // Set the default on the resolveType function.
    field.resolveType = defaultResolveFn;

    return;
  }

  // Ensure it matches the format we expect.
  Joi.assert(
    post,
    Joi.array().items(Joi.func().maxArity(3)),
    `invalid post hooks were found for ${typeName}.${fieldName}`
  );

  // Return the function to handle the resolveType hooks.
  field.resolveType = (obj, context, info) => {
    let type = defaultResolveFn(obj, context, info);

    // Only if a previous resolver was unable to resolve the field type do we
    // progress to the hooks (in order!) to resolve the field name until we
    // have resolved it.
    if (
      typeof type !== 'undefined' &&
      type != null &&
      type !== defaultResolveType
    ) {
      return type;
    }

    // We will walk through the post hooks until we find the right one. This
    // follows what redux does to combine existing reducers.
    for (let i = 0; i < post.length; i++) {
      let resolveType = post[i];
      let resolvedType = resolveType(obj, context, info);
      if (typeof resolvedType !== 'undefined' && resolvedType != null) {
        return resolvedType;
      }
    }

    return type;
  };
};

/**
 * Decorates the schema with pre and post hooks as provided by the Plugin
 * Manager.
 * @param  {GraphQLSchema} schema the schema to decorate
 * @param  {Array}         hooks  hooks to apply to the schema
 * @return {void}
 */
const decorateWithHooks = (schema, hooks) =>
  forEachField(
    schema,
    (field, typeName, fieldName, isResolveType = false) => {
      // Pull out the pre/post hooks from the available hooks.
      const { pre, post } = hooks

        // Only grab hooks that are associated with thie field and typeName.
        .filter(
          ({ hooks }) => typeName in hooks && fieldName in hooks[typeName]
        )

        // Grab the hooks we need.
        .map(({ plugin, hooks }) => ({
          plugin,
          hooks: hooks[typeName][fieldName],
        }))

        // Combine the pre/post hooks from each plugin into an array we can
        // execute.
        .reduce(
          (acc, { plugin, hooks }) => {
            // Itterate over the hooks on the fields and look at it with a switch
            // block to check for misconfigured plugins.
            Object.keys(hooks).forEach(hook => {
              switch (hook) {
                case 'pre':
                  Joi.assert(hooks.pre, Joi.func().maxArity(4));

                  debug(
                    `adding pre hook to resolver ${typeName}.${fieldName} from plugin '${
                      plugin.name
                    }'`
                  );

                  if (typeof hooks.pre !== 'function') {
                    throw new Error(
                      `expected ${hook} hook on resolver ${typeName}.${fieldName} from plugin '${
                        plugin.name
                      }' to be a function, it was a '${typeof hooks[hook]}'`
                    );
                  }

                  acc.pre.push(hooks.pre);
                  break;
                case 'post':
                  Joi.assert(hooks.pre, Joi.func().maxArity(5));

                  debug(
                    `adding post hook to resolver ${typeName}.${fieldName} from plugin '${
                      plugin.name
                    }'`
                  );

                  if (typeof hooks.post !== 'function') {
                    throw new Error(
                      `expected ${hook} hook on resolver ${typeName}.${fieldName} from plugin '${
                        plugin.name
                      }' to be a function, it was a '${typeof hooks[hook]}'`
                    );
                  }

                  acc.post.unshift(hooks.post);
                  break;
                default:
                  throw new Error(
                    `invalid hook '${hook}' on resolver ${typeName}.${fieldName} from plugin '${
                      plugin.name
                    }'`
                  );
              }
            });

            return acc;
          },
          {
            pre: [],
            post: [],
          }
        );

      // If this is a resolve type, we need to do some specific things to handle
      // this type of field.
      if (isResolveType) {
        // Warn if we have any pre hooks.
        if (pre.length !== 0) {
          throw new Error(
            `invalid pre hooks were found for ${typeName}.${fieldName}, only post hooks are supported on the __resolveType hook`
          );
        }

        // Decorate the resolve function on the field with the new resolveType func.
        decorateResolveFunction(field, typeName, fieldName, post);
        return;
      }

      // If we have no hooks to add here, don't try to modify anything.
      if (pre.length === 0 && post.length === 0) {
        return;
      }

      // Cache the original resolve function, this emulates the beheviour found in
      // graphql-tools: https://github.com/apollographql/graphql-tools/blob/6e9cc124b10d673448386041e6c3d058bc205a02/src/schemaGenerator.ts#L423-L425
      let resolve = field.resolve;
      if (typeof resolve === 'undefined') {
        resolve = defaultResolveFn;
      }

      // Apply our async resolve function which will fire all pre functions (and
      // wait until they resolve) followed by waiting for the response and then
      // firing their post hooks. Lastly, we respond with the result of the
      // original resolver.
      field.resolve = async (obj, args, context, info) => {
        // Issue all pre hooks before we resolve the field.
        await Promise.all(pre.map(pre => pre(obj, args, context, info)));

        // Resolve the field.
        let result = await resolve(obj, args, context, info);

        // Insure all post hooks after we've resolved the field with the result
        // passed in as the fifth argument.
        return await post.reduce(async (result, post) => {
          // Wait for the accumulator to resolve before we continue.
          result = await result;

          // Check to see if this post function accepts a result, if it does, we
          // expect that it modifies the result, otherwise, just fire the post hook,
          // wait till it's done, then move onto the next hook.
          if (post.length === 5) {
            return await post(obj, args, context, info, result);
          }

          // Wait for the post hook to finish.
          await post(obj, args, context, info);

          // Return the result, which we already awaited for before.
          return result;
        }, result);
      };
    },
    {
      includeResolveType: true,
    }
  );

module.exports = {
  decorateWithHooks,
};
