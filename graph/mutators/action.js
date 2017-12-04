const errors = require('../../errors');
const UsersService = require('../../services/users');
const {CREATE_ACTION, DELETE_ACTION} = require('../../perms/constants');
const {
  IGNORE_FLAGS_AGAINST_STAFF,
} = require('../../config');

/**
 * getActionItem will return the item that is associated with the given action.
 * If it does not exist, it will throw an error.
 *
 * @param {Object} ctx    the graphql context for the request
 * @param {Object} action the action being performed
 * @return {Promise}      resolves to the referenced item
 */
const getActionItem = async (ctx, {item_id, item_type}) => {
  const {
    loaders: {
      Comments,
      Users,
    },
  } = ctx;

  if (item_type === 'COMMENTS') {
    const comment = await Comments.get.load(item_id);
    if (!comment) {
      throw errors.ErrNotFound;
    }

    return comment;
  } else if (item_type === 'USERS') {
    const user = await Users.getByID.load(item_id);
    if (!user) {
      throw errors.ErrNotFound;
    }

    return user;
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
const createAction = async (ctx, {item_id, item_type, action_type, group_id, metadata = {}}) => {
  const {
    user = {},
    pubsub,
    connectors: {
      services: {
        Actions,
      },
    },
  } = ctx;

  // Gets the item referenced by the action.
  const item = await getActionItem(ctx, {item_id, item_type});

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

  // Create the action itself.
  let action = await Actions.create({
    item_id,
    item_type,
    user_id: user.id,
    group_id,
    action_type,
    metadata
  });

  if (action_type === 'FLAG') {
    if (item_type === 'USERS') {

      // Set the user's status as pending, as we need to review it.
      await UsersService.setStatus(item_id, 'PENDING');
    } else if (item_type === 'COMMENTS') {

      // The item is a comment, and this is a flag. Push that the comment was
      // flagged, don't wait for it to finish.
      pubsub.publish('commentFlagged', item);
    }
  }

  return action;
};

/**
 * Deletes an action based on the user id if the user owns that action.
 * @param  {Object} user the user performing the request
 * @param  {String} id   the id of the action to delete
 * @return {Promise}     resolves to the deleted action, or null if not found.
 */
const deleteAction = (ctx, {id}) => {
  const {
    user,
    connectors: {
      services: {
        Actions,
      },
    },
  } = ctx;

  return Actions.delete({id, user_id: user.id});
};

module.exports = (ctx) => {
  if (ctx.user && ctx.user.can(CREATE_ACTION, DELETE_ACTION)) {
    return {
      Action: {
        create: (action) => createAction(ctx, action),
        delete: (action) => deleteAction(ctx, action)
      }
    };
  }

  return {
    Action: {
      create: () => Promise.reject(errors.ErrNotAuthorized),
      delete: () => Promise.reject(errors.ErrNotAuthorized)
    }
  };
};
