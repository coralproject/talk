const _ = require('lodash');
const DataLoader = require('dataloader');

const CommentModel = require('../../models/comment');

console.warn(
  'Enabling the talk-plugin-deep-reply-count plugin introduces a significant performance impact on larger sites, use with care.'
);

// genDeepCommentCount will return the deep comment count for a given parent id.
const genDeepCommentCount = async (context, parent_ids) => {
  // Get all the replies to the parent comments.
  const replies = await CommentModel.find(
    {
      parent_id: {
        $in: _.uniq(parent_ids),
      },
    },
    {
      id: 1,
      reply_count: 1,
      parent_id: 1,
    }
  );

  // Get all the replies that have comments on them.
  const commentedOnReplies = replies.filter(({ reply_count }) => {
    return reply_count && reply_count > 0;
  });

  let deepReplyCount = [];

  // And if there were any..
  if (commentedOnReplies.length > 0) {
    // Load the reply count for each of them.
    deepReplyCount = await context.loaders.Comments.getDeepCount.loadMany(
      _.uniq(
        commentedOnReplies.map(({ id }) => {
          return id;
        })
      )
    );
  }

  // Get all the direct replies to the parent comments.
  const allDirectReplies = _.groupBy(replies, 'parent_id');

  // Collect all the ancestor replies.
  const allAncestorReplies = _.groupBy(
    _.zip(commentedOnReplies, deepReplyCount),
    ([{ parent_id }]) => {
      return parent_id;
    }
  );

  // Return the replies in an array matching that of the input parent_ids array.
  return parent_ids.map(parent_id => {
    // Get the direct replies to this comment.
    const directReplies =
      parent_id in allDirectReplies ? allDirectReplies[parent_id] : [];
    const ancestorReplies =
      parent_id in allAncestorReplies ? allAncestorReplies[parent_id] : [];

    // Reduce this array.
    return ancestorReplies.reduce((acc, [, count]) => {
      return acc + count;
    }, directReplies.length);
  });
};

module.exports = {
  typeDefs: `
    type Comment {

      # deepReplyCount is the count of all descendant replies.
      deepReplyCount: Int
    }
  `,
  loaders: context => ({
    Comments: {
      getDeepCount: new DataLoader(parent_ids =>
        genDeepCommentCount(context, parent_ids)
      ),
    },
  }),
  resolvers: {
    Comment: {
      deepReplyCount(
        { id },
        args,
        {
          loaders: { Comments },
        }
      ) {
        return Comments.getDeepCount.load(id);
      },
    },
  },
};
