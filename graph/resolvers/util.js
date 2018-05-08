const {
  ADD_COMMENT_TAG,
  SEARCH_OTHER_USERS,
} = require('../../perms/constants');
const { property, isBoolean, pull } = require('lodash');
const graphqlFields = require('graphql-fields');

/**
 * getResolver will get the resolver from the typeResolver or apply the default
 * resolver.
 *
 * @param {Object} typeResolver the type resolver
 * @param {String} field the field name of the resolver we're getting
 */
const getResolver = (typeResolver, field) => {
  if (field in typeResolver) {
    return typeResolver[field];
  }

  return property(field);
};

/**
 *
 * @param {Object} typeResolver the type resolver
 * @param {String} field the name of the field being wrapped
 * @param {Function} customCheck the function that can return a boolean
 *                               indicating the resolution status
 * @param {Function} skipFieldResolver the optional skip resolver that can be used
 *                                 skip out from the oldFieldResolver.
 */
const wrapCheck = (
  typeResolver,
  field,
  customCheck,
  skipFieldResolver = getResolver(typeResolver, field)
) => {
  // Cache the old field resolver. In the event that the check does not return
  // with a boolean, we'll use this.
  const oldFieldResolver = getResolver(typeResolver, field);

  // Override the field resolver on the type resolver with this wrapped
  // function.
  typeResolver[field] = (obj, args, ctx, info) => {
    const decision = customCheck(obj, args, ctx, info);
    if (isBoolean(decision)) {
      if (decision) {
        // The custom check returns a boolean true, so we should execute the
        // underlying field resolver (which may just be the old resolver).
        return skipFieldResolver(obj, args, ctx, info);
      }

      // The custom check returns a boolean false, then we should return null,
      // because the check explicity said that we weren't allowed to access that
      // field.
      return null;
    }

    // The custom check yielded no decision, so we should just fall back to the
    // oldFieldResolver.
    return oldFieldResolver(obj, args, ctx, info);
  };
};

/**
 * checkPermissions checks that the current user has all the required
 * permissions.
 *
 * @param {Object} ctx graph context
 * @param {Array<String>} permissions permissions that the user must have
 */
const checkPermissions = (ctx, permissions) =>
  !ctx.user || !ctx.user.can(...permissions);

/**
 * wrapCheckPermissions will wrap a specific field with a permission check.
 *
 * @param {Object} typeResolver the type resolver
 * @param {String} field the field name of the resolver we're wrapping
 * @param {Array<String>} permissions array of permissions to check against
 * @param {Function} fieldResolver base resolver for the field
 */
const wrapCheckPermissions = (
  typeResolver,
  field,
  permissions,
  skipFieldResolver = getResolver(typeResolver, field)
) =>
  wrapCheck(
    typeResolver,
    field,
    (obj, args, ctx) => !checkPermissions(ctx, permissions),
    skipFieldResolver
  );

/**
 * decorateWithPermissionCheck will decorate the field resolver with
 * permission checks.
 *
 * @param {Object} typeResolver the type resolver
 * @param {Object} protect the object with field -> Array<String> of permissions
 * @param {Function} customCheck a function that can return a boolean based on a
 *                               custom check
 */
const decorateWithPermissionCheck = (
  typeResolver,
  protect,
  customCheck = null
) => {
  for (const [field, permissions] of Object.entries(protect)) {
    const baseFieldResolver = getResolver(typeResolver, field);
    wrapCheckPermissions(typeResolver, field, permissions, baseFieldResolver);

    if (customCheck !== null) {
      wrapCheck(typeResolver, field, customCheck, baseFieldResolver);
    }
  }
};

/**
 * checkSelf will check if the current object is the same as the current user.
 *
 * @param {String} referenceField the field for the user id to check.
 */
const checkSelfField = referenceField => (obj, args, ctx) => {
  if (
    ctx.user &&
    obj[referenceField] !== null &&
    ctx.user.id === obj[referenceField]
  ) {
    return true;
  }
};

/**
 * wrapCheckSelf wraps a typeResolver with a check for self (if the type is
 * referencing the current user).
 *
 * @param {Object} typeResolver the type resolver
 * @param {String} field the field to decorate
 * @param {String} referenceField the field to pull the user id from.
 * @param {Function} fieldResolver base resolver for the field
 */
const wrapCheckSelf = (
  typeResolver,
  field,
  referenceField = field,
  fieldResolver = getResolver(typeResolver, field)
) =>
  wrapCheck(typeResolver, field, checkSelfField(referenceField), fieldResolver);

/**
 * decorateUserField will decorate the user field accesses with correct
 * permission checks and will load the user.
 *
 * @param {Object} typeResolver the type resolver
 * @param {String} field the field to decorate
 * @param {String} referenceField the field to pull the user id from.
 */
const decorateUserField = (typeResolver, field, referenceField = field) => {
  // The default resolver for the user decorator is loading the user by id.
  let fieldResolver = (obj, args, ctx) => {
    if (!obj[referenceField]) {
      return null;
    }
    return ctx.loaders.Users.getByID.load(obj[referenceField]);
  };

  // The resolver can be overridden however. This decorator will simply wrap the
  // field with a permission check.
  if (field in typeResolver) {
    fieldResolver = typeResolver[field];
  }

  // Wrap the current fieldResolver with the resolver which will return the
  // user.
  wrapCheckPermissions(
    typeResolver,
    field,
    [SEARCH_OTHER_USERS],
    fieldResolver
  );

  // Wrap the checked resolver with a check to see if the current user is the
  // one being retrieved, in which case we should allow it.
  wrapCheckSelf(typeResolver, field, referenceField, fieldResolver);
};

/**
 * decorateWithTags decorates a typeResolver with a tags getter that will
 * sanitize the tag output for users without permission to see non-public
 * tags.
 *
 * @param {Object} typeResolver base type resolver
 * @param {Function} fieldResolver the field resolver that gets the tags
 */
const decorateWithTags = (
  typeResolver,
  fieldResolver = getResolver(typeResolver, 'tags')
) => {
  typeResolver.tags = async (obj, args, ctx, info) => {
    const tags = await fieldResolver(obj, args, ctx, info);
    if (checkPermissions(ctx, [ADD_COMMENT_TAG])) {
      return tags;
    }

    return tags.filter(t => t.tag.permissions.public);
  };
};

const getRequestedFields = info =>
  pull(Object.keys(graphqlFields(info)), '__typename');

module.exports = {
  getRequestedFields,
  decorateUserField,
  decorateWithTags,
  decorateWithPermissionCheck,
  checkSelfField,
};
