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

module.exports = {
  decorateWithTags
};
