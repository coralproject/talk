const ActionModel = require('../../models/action');
const ActionsService = require('../../services/actions');
const UsersService = require('../../services/users');
const errors = require('../../errors');

/**
 * Creates an action on a item. If the item is a user flag, sets the user's status to
 * pending.
 * @param  {Object} user        the user performing the request
 * @param  {String} item_id     id of the item to add the action to
 * @param  {String} item_type   type of the item
 * @param  {String} action_type type of the action
 * @return {Promise}            resolves to the action created
 */
const createAction = ({user = {}}, {item_id, item_type, action_type, group_id, metadata = {}}) => {
  return ActionsService.insertUserAction({
    item_id,
    item_type,
    user_id: user.id,
    group_id,
    action_type,
    metadata
  }).then((action) => {
    if (item_type === 'USERS' && action_type === 'FLAG') {
      return UsersService
        .setStatus(item_id, 'PENDING')
        .then(() => action);
    }

    return action;
  });
};

/**
 * Deletes an action based on the user id if the user owns that action.
 * @param  {Object} user the user performing the request
 * @param  {String} id   the id of the action to delete
 * @return {Promise}     resolves when the action is deleted
 */
const deleteAction = ({user}, {id}) => {
  return ActionModel.remove({
    id,
    user_id: user.id
  });
};

module.exports = (context) => {

  // TODO: refactor to something that'll return an error in the event an attempt
  // is made to mutate state while not logged in. There's got to be a better way
  // to do this.
  if (context.user && context.user.can('mutation:createAction', 'mutation:deleteAction')) {
    return {
      Action: {
        create: (action) => createAction(context, action),
        delete: (action) => deleteAction(context, action)
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
