const ActionsService = require('../../services/actions');
const UsersService = require('../../services/users');
const errors = require('../../errors');
const {CREATE_ACTION, DELETE_ACTION} = require('../../perms/constants');

/**
 * getActionItem will return the item that is associated with the given action.
 * If it does not exist, it will throw an error.
 *
 * @param {Object} ctx    the graphql context for the request
 * @param {Object} action the action being performed
 * @return {Promise}      resolves to the referenced item
 */
const getActionItem = async ({loaders: {Comments, Users}}, {item_id, item_type}) => {
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
  const {user = {}, pubsub} = ctx;

  // Gets the item referenced by the action.
  const item = await getActionItem(ctx, {item_id, item_type});

  // Create the action itself.
  let action = await ActionsService.create({
    item_id,
    item_type,
    user_id: user.id,
    group_id,
    action_type,
    metadata
  });

  // If the action is a flag.
  if (action_type === 'FLAG') {
    if (item_type === 'USERS') {

      // Set the user as pending if it was a user flag.
      await UsersService.setStatus(item_id, 'PENDING');
    } else if (item_type === 'COMMENTS') {

      // Push that the comment was flagged, don't wait for it to finish.
      pubsub.publish('commentFlagged', item);
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
const deleteAction = ({user}, {id}) => ActionsService.delete({id, user_id: user.id});

module.exports = (ctx) => {
  const mutators = {
    Action: {
      create: () => Promise.reject(errors.ErrNotAuthorized),
      delete: () => Promise.reject(errors.ErrNotAuthorized)
    }
  };

  if (ctx.user && ctx.user.can(CREATE_ACTION)) {
    mutators.Action.create = (action) => createAction(ctx, action);
  }

  if (ctx.user && ctx.user.can(DELETE_ACTION)) {
    mutators.Action.delete = (action) => deleteAction(ctx, action);
  }

  return mutators;
};
