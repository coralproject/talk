const {ADD_COMMENT_TAG} = require('../../perms/constants');

/**
 * Decorates the typeResolver with the tags field.
 */
const decorateWithTags = (typeResolver) => {
  typeResolver.tags = ({tags = []}, _, {user}) => {
    if (user && user.can(ADD_COMMENT_TAG)) {
      return tags;
    }

    return tags.filter((t) => t.tag.permissions.public);
  };
};

/**
 * decorateWithPermissionCheck will decorate the field resolver with
 * permission checks.
 *
 * @param {Object} typeResolver the type resolver
 * @param {String} permission the permission constant used to check against the user
 * @param {Array<String>} fields the fields to apply this check to
 */
const decorateWithPermissionCheck = (typeResolver, permission, ...fields) => {
  for (const field of fields) {
    let fieldResolver = (obj) => obj[field];
    if (field in typeResolver) {
      fieldResolver = typeResolver[field];
    }

    typeResolver[field] = (obj, args, ctx, info) => {
      if (!ctx.user || !ctx.user.can(permission)) {
        return null;
      }

      return fieldResolver(obj, args, ctx, info);
    };
  }
};

module.exports = {
  decorateWithTags,
  decorateWithPermissionCheck,
};
