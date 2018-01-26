const ActionModel = require('../models/action');
const UserModel = require('../models/user');
const CommentModel = require('../models/comment');

module.exports = {
  async up({ transformSingleWithCursor }) {
    const models = [
      { Model: CommentModel, item_type: 'COMMENTS' },
      { Model: UserModel, item_type: 'USERS' },
    ];
    for (const { Model, item_type } of models) {
      let cursor = ActionModel.collection.aggregate(
        [
          {
            $match: {
              group_id: { $ne: null },
              item_type,
            },
          },
          {
            $group: {
              // group unique documents by these properties, we are leveraging the
              // fact that each uuid is completely unique.
              _id: {
                item_id: '$item_id',
                action_type: '$action_type',
                group_id: '$group_id',
              },

              // and sum up all actions matching the above grouping criteria
              count: {
                $sum: 1,
              },
            },
          },
          {
            $project: {
              // suppress the _id field
              _id: false,

              // map the fields from the _id grouping down a level
              item_id: '$_id.item_id',
              action_type: { $toLower: '$_id.action_type' },
              group_id: { $toLower: '$_id.group_id' },

              // map the field directly
              count: '$count',
            },
          },
        ],
        { allowDiskUse: true }
      );

      // Transform those documents.
      await transformSingleWithCursor(
        cursor,
        ({ item_id, action_type, group_id, count }) => ({
          query: { id: item_id },
          update: {
            $set: {
              [`action_counts.${action_type}_${group_id}`]: count,
            },
          },
        }),
        Model
      );

      // Secondly, we'll collect the group group id's (all the actions for a
      // specific action type) to update counts of.
      cursor = ActionModel.collection.aggregate(
        [
          {
            $match: {
              item_type,
            },
          },
          {
            $group: {
              // group unique documents by these properties, we are leveraging the
              // fact that each uuid is completely unique.
              _id: {
                item_id: '$item_id',
                action_type: '$action_type',
              },

              // and sum up all actions matching the above grouping criteria
              count: {
                $sum: 1,
              },
            },
          },
          {
            $project: {
              // suppress the _id field
              _id: false,

              // map the fields from the _id grouping down a level
              item_id: '$_id.item_id',
              action_type: { $toLower: '$_id.action_type' },

              // map the field directly
              count: '$count',
            },
          },
        ],
        { allowDiskUse: true }
      );

      // Transform those documents.
      await transformSingleWithCursor(
        cursor,
        ({ item_id, action_type, count }) => ({
          query: { id: item_id },
          update: {
            $set: {
              [`action_counts.${action_type}`]: count,
            },
          },
        }),
        Model
      );
    }
  },
};
