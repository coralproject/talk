const CommentModel = require('../models/comment');

const transformComments = ({ _id: parent_id, reply_count }) => ({
  query: { id: parent_id, reply_count: { $ne: reply_count } },
  update: { $set: { reply_count } },
});

module.exports = {
  async up({ transformSingleWithCursor }) {
    const cursor = CommentModel.collection.aggregate(
      [
        {
          $match: {
            parent_id: { $ne: null },
            status: { $in: ['NONE', 'ACCEPTED'] },
          },
        },
        {
          $group: {
            _id: '$parent_id',
            reply_count: {
              $sum: 1,
            },
          },
        },
      ],
      { allowDiskUse: true }
    );

    // Transform those documents.
    await transformSingleWithCursor(cursor, transformComments, CommentModel);
  },
};
