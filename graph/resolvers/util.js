const {
  ADD_COMMENT_TAG,
  SEARCH_OTHER_USERS,
} = require('../../perms/constants');
const property = require('lodash/property');

/**
 * Decorates the typeResolver with the tags field.
 */
const decorateWithTags = typeResolver => {
  typeResolver.tags = ({ tags = [] }, _, { user }) => {
    if (user && user.can(ADD_COMMENT_TAG)) {
      return tags;
    }

    return tags.filter(t => t.tag.permissions.public);
  };
};

/**
 * decorateWithPermissionCheck will decorate the field resolver with
 * permission checks.
 *
 * @param {Object} typeResolver the type resolver
 * @param {Object} protect the object with field -> Array<String> of permissions
 */
const decorateWithPermissionCheck = (typeResolver, protect) => {
  for (const [field, permissions] of Object.entries(protect)) {
    let fieldResolver = property(field);
    if (field in typeResolver) {
      fieldResolver = typeResolver[field];
    }

    typeResolver[field] = (obj, args, ctx, info) => {
      if (!ctx.user || !ctx.user.can(...permissions)) {
        return null;
      }

      return fieldResolver(obj, args, ctx, info);
    };
  }
};

/**
 * decorateUserField will decorate the user field accesses with correct
 * permission checks.
 *
 * @param {Object} typeResolver the type resolver
 * @param {String} field the field to decorate
 */
const decorateUserField = (typeResolver, field) => {
  // The default resolver for the user decorator is loading the user by id.
  let fieldResolver = (obj, args, ctx) =>
    ctx.loaders.Users.getByID.load(obj[field]);

  // The resolver can be overridden however. This decorator will simply wrap the
  // field with a permission check.
  if (field in typeResolver) {
    fieldResolver = typeResolver[field];
  }

  typeResolver[field] = (obj, args, ctx, info) => {
    if (
      !ctx.user ||
      obj[field] === null ||
      (ctx.user.id !== obj[field] && !ctx.user.can(SEARCH_OTHER_USERS))
    ) {
      return null;
    }

    return fieldResolver(obj, args, ctx, info);
  };
};

module.exports = {
  decorateUserField,
  decorateWithTags,
  decorateWithPermissionCheck,
};
