const { SEARCH_OTHER_USERS } = require('../../perms/constants');

const TagLink = {
  assigned_by({ assigned_by }, _, { user, loaders: { Users } }) {
    if (user && user.can(SEARCH_OTHER_USERS) && assigned_by != null) {
      return Users.getByID.load(assigned_by);
    }
  },
};

module.exports = TagLink;
