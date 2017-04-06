const {forEachField} = require('graphql-tools');
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
const defaultResolveFn = (source, args, context, {fieldName}) => {

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
 * Decorates the schema with pre and post hooks as provided by the Plugin
 * Manager.
 * @param  {GraphQLSchema} schema the schema to decorate
 * @param  {Array}         hooks  hooks to apply to the schema
 * @return {void}
 */
const decorateWithHooks = (schema, hooks) => forEachField(schema, (field, typeName, fieldName) => {

  // Pull out the pre/post hooks from the available hooks.
  const {
    pre,
    post
  } = hooks

    // Only grab hooks that are associated with thie field and typeName.
    .filter(({hooks}) => (typeName in hooks) && (fieldName in hooks[typeName]))

    // Grab the hooks we need.
    .map(({plugin, hooks}) => ({plugin, hooks: hooks[typeName][fieldName]}))

    // Combine the pre/post hooks from each plugin into an array we can
    // execute.
    .reduce((acc, {plugin, hooks}) => {
      Joi.assert(hooks, Joi.object({
        pre: Joi.func(),
        post: Joi.func()
      }), `Plugin '${plugin.name}' had an error loading the hooks`);

      // Itterate over the hooks on the fields and look at it with a switch
      // block to check for misconfigured plugins.
      Object.keys(hooks).forEach((hook) => {
        switch (hook) {
        case 'pre':
          debug(`adding pre hook to resolver ${typeName}.${fieldName} from plugin '${plugin.name}'`);

          if (typeof hooks.pre !== 'function') {
            throw new Error(`expected ${hook} hook on resolver ${typeName}.${fieldName} from plugin '${plugin.name}' to be a function, it was a '${typeof hooks[hook]}'`);
          }

          acc.pre.push(hooks.pre);
          break;
        case 'post':
          debug(`adding post hook to resolver ${typeName}.${fieldName} from plugin '${plugin.name}'`);

          if (typeof hooks.post !== 'function') {
            throw new Error(`expected ${hook} hook on resolver ${typeName}.${fieldName} from plugin '${plugin.name}' to be a function, it was a '${typeof hooks[hook]}'`);
          }

          acc.post.unshift(hooks.post);
          break;
        default:
          throw new Error(`invalid hook '${hook}' on resolver ${typeName}.${fieldName} from plugin '${plugin.name}'`);
        }
      });

      return acc;
    }, {
      pre: [],
      post: []
    });

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
    await Promise.all(pre.map((pre) => pre(obj, args, context, info)));

    // Resolve the field.
    let result = resolve(obj, args, context, info);

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
});

module.exports = {
  decorateWithHooks
};
