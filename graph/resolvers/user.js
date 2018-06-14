const {
  decorateWithTags,
  decorateWithPermissionCheck,
  checkSelfField,
} = require('./util');
const KarmaService = require('../../services/karma');
const {
  SEARCH_ACTIONS,
  SEARCH_OTHER_USERS,
  SEARCH_OTHERS_COMMENTS,
  VIEW_USER_ROLE,
  LIST_OWN_TOKENS,
  VIEW_USER_STATUS,
  VIEW_USER_EMAIL,
} = require('../../perms/constants');
const { property } = require('lodash');

const User = {
  action_summaries(
    user,
    _,
    {
      loaders: { Actions },
    }
  ) {
    return Actions.getSummariesByItem.load(user);
  },
  actions(
    { id },
    _,
    {
      loaders: { Actions },
    }
  ) {
    return Actions.getByID.load(id);
  },
  comments(
    { id },
    { query },
    {
      loaders: { Comments },
    }
  ) {
    // Set the author id on the query.
    query.author_id = id;

    return Comments.getByQuery(query);
  },

  ignoredUsers(
    { ignoresUsers },
    args,
    {
      loaders: { Users },
    }
  ) {
    // Return nothing if there is nothing to query for.
    if (!ignoresUsers || ignoresUsers.length <= 0) {
      return [];
    }

    return Users.getByID.loadMany(ignoresUsers);
  },

  // Extract the reliability from the user metadata if they have permission.
  reliable: user => KarmaService.model(user),

  // The state requires the whole user object to make decisions.
  state: user => user,

  // Get the first email on the user.
  email: property('firstEmail'),
};

// Decorate the User type resolver with a tags field.
decorateWithTags(User);

// decorate the fields on the User resolver with a permission check where the
// current user can also get their own properties.
decorateWithPermissionCheck(
  User,
  {
    actions: [SEARCH_ACTIONS],
    email: [VIEW_USER_EMAIL],
    state: [VIEW_USER_STATUS],
    role: [VIEW_USER_ROLE],
    ignoredUsers: [SEARCH_OTHER_USERS],
    tokens: [LIST_OWN_TOKENS],
    profiles: [SEARCH_OTHER_USERS],
    comments: [SEARCH_OTHERS_COMMENTS],
  },
  checkSelfField('id')
);

// Decorate the fields on the User resolver where the current user has no impact
// on the resolvability of a field.
decorateWithPermissionCheck(User, { reliable: [SEARCH_ACTIONS] });

module.exports = User;
