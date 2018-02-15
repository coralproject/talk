const ActionModel = require('../models/action');
const CommentModel = require('../models/comment');
const UserModel = require('../models/user');
const _ = require('lodash');
const errors = require('../errors');
const events = require('./events');
const { ACTIONS_NEW, ACTIONS_DELETE } = require('./events/constants');

/**
 * findOnlyOneAndUpdate will perform a fondOneAndUpdate on the mongo collection
 * and ensure that the found record wasn't already found. This is essentially
 * a "findOneOrUpsert".
 *
 * @param {object} query the query operation for the mongo findOneAndUpdate op
 * @param {object} update the update operation for the mongo findOneAndUpdate op
 * @param {object} options the options operation for the mongo findOneAndUpdate op
 */
const findOnlyOneAndUpdate = async (query, update, options = {}) =>
  new Promise((resolve, reject) => {
    ActionModel.findOneAndUpdate(
      query,
      update,
      Object.assign({}, options, {
        // Use raw result to get `updatedExisting`.
        passRawResult: true,

        // Ensure that if it's new, we return the new object created.
        new: true,

        // Perform an upsert in the event that this doesn't exist.
        upsert: true,

        // Set the default values if not provided based on the mongoose models.
        setDefaultsOnInsert: true,
      }),
      (err, doc, raw) => {
        if (err) {
          return reject(err);
        }
        if (raw.lastErrorObject.updatedExisting) {
          return reject(new errors.ErrAlreadyExists(raw.value));
        }
        return resolve(raw.value);
      }
    );
  });

module.exports = class ActionsService {
  /**
   * Finds an action by the id.
   *
   * @param {String} id  identifier of the action (uuid)
   */
  static findById(id) {
    return ActionModel.findOne({ id });
  }

  /**
   * Inserts an action.
   *
   * @param {String} item_id  identifier of the item (uuid)
   * @param {String} user_id  user id of the action (uuid)
   * @param {String} action   the new action to the item
   * @return {Promise}
   */
  static async create(action) {
    // Actions are made unique by using a query that can be reproducable, i.e.,
    // not containing user inputable values.
    let foundAction = await findOnlyOneAndUpdate(
      {
        action_type: action.action_type,
        item_type: action.item_type,
        item_id: action.item_id,
        user_id: action.user_id,
        group_id: action.group_id,
      },
      {
        // Only set when not existing.
        $setOnInsert: action,
      }
    );

    // Emit that there was a new action created.
    await events.emitAsync(ACTIONS_NEW, foundAction);

    return foundAction;
  }

  /**
   * Finds actions in an array of ids.
   *
   * @param {String} ids array of user identifiers (uuid)
   */
  static async findByItemIdArray(item_ids) {
    let actions = await ActionModel.find({
      item_id: { $in: item_ids },
    });

    if (actions === null) {
      return [];
    }

    return actions;
  }

  /**
   * Get the actions for a specific user on the specific items.
   *
   * @param {String} userID the id of the user to find their actions for
   * @param {Array<String>} itemIDs the ids of the items to find their actions
   *                                for
   */
  static getUserActions(userID, itemIDs) {
    return ActionModel.find({
      user_id: userID,
      item_id: {
        $in: itemIDs,
      },
    });
  }

  /**
   * Finds all comments for a specific action.
   *
   * @param {String} action_type type of action
   * @param {String} item_type type of item the action is on
   */
  static findByType(action_type, item_type) {
    return ActionModel.find({
      action_type: action_type,
      item_type: item_type,
    });
  }

  /**
   * delete will remove the record from the collection if it exists. Otherwise
   * it will do nothing. This will then return the deleted action.
   *
   * @param {object} param the action to use as the query source, for which we
   *                       only look at the id, user_id.
   */
  static async delete({ id, user_id }) {
    let action = await ActionModel.findOneAndRemove({
      id,
      user_id,
    });
    if (!action) {
      return;
    }

    // Emit that the action was deleted.
    await events.emitAsync(ACTIONS_DELETE, action);

    return action;
  }

  /**
   * Finds all comments ids for a specific action.
   *
   * @param {String} action_type type of action
   * @param {String} item_type type of item the action is on
   */
  static findCommentsIdByActionType(action_type, item_type) {
    return ActionModel.find(
      {
        action_type: action_type,
        item_type: item_type,
      },
      'item_id'
    );
  }
};

const incrActionCounts = async (action, value) => {
  const ACTION_TYPE = action.action_type.toLowerCase();

  const update = {
    [`action_counts.${ACTION_TYPE}`]: value,
  };

  if (action.group_id && action.group_id.length > 0) {
    const GROUP_ID = action.group_id.toLowerCase();

    update[`action_counts.${ACTION_TYPE}_${GROUP_ID}`] = value;
  }

  try {
    switch (action.item_type) {
      case 'USERS':
        return UserModel.update(
          {
            id: action.item_id,
          },
          {
            $inc: update,
          }
        );
      case 'COMMENTS':
        return CommentModel.update(
          {
            id: action.item_id,
          },
          {
            $inc: update,
          }
        );
      default:
        throw new Error('Invalid item type for action summary monitoring');
    }
  } catch (err) {
    console.error(`Can't mutate the action_counts.${ACTION_TYPE}:`, err);
  }
};

// When a new action is created, modify the comment.
events.on(ACTIONS_NEW, async action => {
  if (
    !action ||
    (action.item_type !== 'COMMENTS' && action.item_type !== 'USERS')
  ) {
    return;
  }

  return incrActionCounts(action, 1);
});

// When an action is deleted, remove the action count on the comment.
events.on(ACTIONS_DELETE, async action => {
  if (
    !action ||
    (action.item_type !== 'COMMENTS' && action.item_type !== 'USERS')
  ) {
    return;
  }

  return incrActionCounts(action, -1);
});
