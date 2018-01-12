const { decorateWithTags } = require('./util');
const KarmaService = require('../../services/karma');
const {
  SEARCH_ACTIONS,
  SEARCH_OTHER_USERS,
  SEARCH_OTHERS_COMMENTS,
  VIEW_USER_ROLE,
  LIST_OWN_TOKENS,
  VIEW_USER_STATUS,
} = require('../../perms/constants');

const User = {
  action_summaries({ id }, _, { loaders: { Actions } }) {
    return Actions.getSummariesByItemID.load(id);
  },
  actions({ id }, _, { user, loaders: { Actions } }) {
    // Only return the actions if the user is not an admin.
    if (user && user.can(SEARCH_ACTIONS)) {
      return Actions.getByID.load(id);
    }
  },
  comments({ id }, { query }, { loaders: { Comments }, user }) {
    // If there is no user, or there is a user, but they are requesting someone
    // else's comments, and they aren't allowed, don't return then anything!
    if (!user || (user.id !== id && !user.can(SEARCH_OTHERS_COMMENTS))) {
      return null;
    }

    // Set the author id on the query.
    query.author_id = id;

    return Comments.getByQuery(query);
  },
  profiles({ profiles }, _, { user }) {
    // if the user is not an admin, do not return the profiles
    if (user && user.can(SEARCH_OTHER_USERS)) {
      return profiles;
    }

    return null;
  },
  tokens({ id, tokens }, args, { user }) {
    if (!user || (user.id !== id && !user.can(LIST_OWN_TOKENS))) {
      return null;
    }

    return tokens;
  },
  ignoredUsers({ id }, args, { user, loaders: { Users } }) {
    // Only allow a logged in user that is either the current user or is a staff
    // member to access the ignoredUsers of a given user.
    if (!user || (user.id !== id && !user.can(SEARCH_OTHER_USERS))) {
      return null;
    }

    // Return nothing if there is nothing to query for.
    if (!user.ignoresUsers || user.ignoresUsers.length <= 0) {
      return [];
    }

    return Users.getByID.loadMany(user.ignoresUsers);
  },
  role({ id, role }, _, { user }) {
    // If the user is not an admin, only return the current user's roles.
    if (user && (user.can(VIEW_USER_ROLE) || user.id === id)) {
      return role;
    }

    return null;
  },

  // Extract the reliability from the user metadata if they have permission.
  reliable(user, _, { user: requestingUser }) {
    if (requestingUser && requestingUser.can(SEARCH_ACTIONS)) {
      return KarmaService.model(user);
    }
  },

  state(user, args, ctx) {
    if (
      ctx.user &&
      (ctx.user.id === user.id || ctx.user.can(VIEW_USER_STATUS))
    ) {
      return user;
    }
  },
};

// Decorate the User type resolver with a tags field.
decorateWithTags(User);

module.exports = User;
