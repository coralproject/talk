const ActionModel = require('../models/action');
const CommentModel = require('../models/comment');
const UserModel = require('../models/user');
const _ = require('lodash');
const { ErrAlreadyExists } = require('../errors');

const incrActionCounts = async (action, value) => {
  const ACTION_TYPE = action.action_type.toLowerCase();

  const query = { id: action.item_id };
  const update = {
    [`action_counts.${ACTION_TYPE}`]: value,
  };

  if (action.group_id && action.group_id.length > 0) {
    const GROUP_ID = action.group_id.toLowerCase();

    update[`action_counts.${ACTION_TYPE}_${GROUP_ID}`] = value;
  }

  switch (action.item_type) {
    case 'USERS':
      return UserModel.update(query, {
        $inc: update,
      });
    case 'COMMENTS':
      return CommentModel.update(query, {
        $inc: update,
      });
    default:
      return;
  }
};

/**
 * findOnlyOneAndUpdate will perform a fondOneAndUpdate on the mongo collection
 * and ensure that the found record wasn't already found. This is essentially
 * a "findOneOrUpsert".
 *
 * @param {object} query the query operation for the mongo findOneAndUpdate op
 * @param {object} update the update operation for the mongo findOneAndUpdate op
 * @param {object} options the options operation for the mongo findOneAndUpdate op
 */
const findOnlyOneAndUpdate = async (query, update, options = {}) => {
  const raw = await ActionModel.findOneAndUpdate(
    query,
    update,
    Object.assign({}, options, {
      // Use raw result to get `updatedExisting`.
      rawResult: true,

      // Ensure that if it's new, we return the new object created.
      new: true,

      // Perform an upsert in the event that this doesn't exist.
      upsert: true,

      // Set the default values if not provided based on the mongoose models.
      setDefaultsOnInsert: true,
    })
  );
  if (raw.lastErrorObject.updatedExisting) {
    throw new ErrAlreadyExists(raw.value);
  }

  return raw.value;
};

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
   * @param {String} action   the new action to the item
   * @return {Promise}
   */
  static async create(action) {
    // Actions are made unique by using a query that can be reproducible, i.e.,
    // not containing user modifiable values.
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

    await incrActionCounts(action, 1);

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

    await incrActionCounts(action, -1);

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
