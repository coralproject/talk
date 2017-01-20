const Action = require('../../models/action');

/**
 * Creates an action on a item.
 * @param  {Object} user        the user performing the request
 * @param  {String} item_id     id of the item to add the action to
 * @param  {String} item_type   type of the item
 * @param  {String} action_type type of the action
 * @return {Promise}            resolves to the action created
 */
const createAction = ({user = {}}, {item_id, item_type, action_type, metadata = {}}) => {
  return Action.insertUserAction({
    item_id,
    item_type,
    user_id: user.id,
    action_type,
    metadata
  });
};

/**
 * Deletes an action based on the user id if the user owns that action.
 * @param  {Object} user the user performing the request
 * @param  {String} id   the id of the action to delete
 * @return {Promise}     resolves when the action is deleted
 */
const deleteAction = ({user}, {id}) => {
  return Action.remove({
    id,
    user_id: user.id
  });
};

module.exports = (context) => {

  // TODO: refactor to something that'll return an error in the event an attempt
  // is made to mutate state while not logged in. There's got to be a better way
  // to do this.
  if (context.user) {
    return {
      Action: {
        create: (action) => createAction(context, action),
        delete: (action) => deleteAction(context, action)
      }
    };
  }

  return {
    Action: {
      create: () => {},
      delete: () => {}
    }
  };
};
