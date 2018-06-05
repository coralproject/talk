const { ErrNotFound, ErrNotAuthorized } = require('../../errors');
const { CREATE_ACTION, DELETE_ACTION } = require('../../perms/constants');
const { IGNORE_FLAGS_AGAINST_STAFF } = require('../../config');

/**
 * getActionItem will return the item that is associated with the given action.
 * If it does not exist, it will throw an error.
 *
 * @param {Object} ctx    the graphql context for the request
 * @param {Object} action the action being performed
 * @return {Promise}      resolves to the referenced item
 */
const getActionItem = async (ctx, { item_id, item_type }) => {
  const {
    loaders: { Comments, Users },
  } = ctx;

  switch (item_type) {
    case 'COMMENTS': {
      // Get a comment by ID, unless the comment is deleted, then return null.
      const comment = await Comments.get.load(item_id);
      if (comment.deleted_at) {
        return null;
      }

      return comment;
    }
    case 'USERS':
      return Users.getByID.load(item_id);
    default:
      return null;
  }
};

/**
 * Creates an action on a item. If the item is a user flag, sets the user's status to
 * pending.
 *
 * @param  {Object} ctx    the graphql context for the request
 * @param  {Object} action the action being created
 * @return {Promise}       resolves to the action created
 */
const createAction = async (
  ctx,
  { item_id, item_type, action_type, group_id, metadata = {} }
) => {
  const {
    user = {},
    pubsub,
    connectors: {
      services: { Actions },
    },
  } = ctx;

  // Gets the item referenced by the action.
  const item = await getActionItem(ctx, { item_id, item_type });
  if (!item || item === null) {
    throw new ErrNotFound();
  }

  // If we are ignoring flags against staff, ensure that the target isn't a
  // staff member.
  if (IGNORE_FLAGS_AGAINST_STAFF) {
    if (action_type === 'FLAG') {
      // If the item is a user, and this is a flag. Check to see if they are
      // staff, if they are, don't permit the flag.
      if (item_type === 'USERS' && item.isStaff()) {
        return null;
      }
    }
  }

  if (action_type === 'FLAG' && item_type === 'USERS') {
    // The item is a user, and this is a flag. Check to see if they are staff,
    // if they are, don't permit the flag.
    if (item.isStaff()) {
      throw new ErrNotAuthorized();
    }
  }

  // Create the action itself.
  let action = await Actions.create({
    item_id,
    item_type,
    user_id: user.id,
    group_id,
    action_type,
    metadata,
  });

  if (action_type === 'FLAG') {
    switch (item_type) {
      case 'COMMENTS':
        // The item is a comment, and this is a flag. Push that the comment was
        // flagged, don't wait for it to finish.
        pubsub.publish('commentFlagged', item);
        break;
      case 'USERS':
        // The item is a user, and this is a flag. Push that the user was
        // flagged, don't wait for it to finish.
        pubsub.publish('usernameFlagged', item);
        break;
      default:
    }
  }

  return action;
};

/**
 * Deletes an action based on the user id if the user owns that action.
 *
 * @param  {Object} user the user performing the request
 * @param  {String} id   the id of the action to delete
 * @return {Promise}     resolves to the deleted action, or null if not found.
 */
const deleteAction = (ctx, { id }) => {
  const {
    user,
    connectors: {
      services: { Actions },
    },
  } = ctx;

  return Actions.delete({ id, user_id: user.id });
};

module.exports = ctx => {
  let mutators = {
    Action: {
      create: () => Promise.reject(new ErrNotAuthorized()),
      delete: () => Promise.reject(new ErrNotAuthorized()),
    },
  };

  if (ctx.user && ctx.user.can(CREATE_ACTION)) {
    mutators.Action.create = action => createAction(ctx, action);
  }

  if (ctx.user && ctx.user.can(DELETE_ACTION)) {
    mutators.Action.delete = action => deleteAction(ctx, action);
  }

  return mutators;
};
