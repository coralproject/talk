const CommentModel = require('../../../models/comment');
const { singleJoinBy } = require('../../../graph/loaders/util');
const debug = require('debug')('talk:cli:verify');

const getBatch = async (limit, offset) =>
  CommentModel.find({})
    .select({ id: 1, action_counts: 1, reply_count: 1 })
    .limit(limit)
    .skip(offset)
    .sort('created_at');

module.exports = async ({ fix, limit, batch }) => {
  let operations = [];

  // Count how many comments there are to process.
  const totalCount = await CommentModel.count();

  let offset = 0;
  let comments = [];
  let commentIDs = [];

  console.log(`Processing ${totalCount} comments in batches of ${limit}...`);

  // Keep processing documents until there are is none left.
  while (offset < totalCount) {
    // Get a batch of comments.
    comments = await getBatch(batch, offset);
    commentIDs = comments.map(({ id }) => id);

    // Get their reply counts.
    let allReplyCounts = await CommentModel.aggregate([
      {
        $match: {
          parent_id: {
            $in: commentIDs,
          },
          status: {
            $in: ['NONE', 'ACCEPTED'],
          },
        },
      },
      {
        $group: {
          _id: '$parent_id',
          count: {
            $sum: 1,
          },
        },
      },
    ])
      .then(singleJoinBy(commentIDs, '_id'))
      .then(results => results.map(result => (result ? result.count : 0)));

    // Loop over the comments, with their action summaries.
    for (let i = 0; i < comments.length; i++) {
      let comment = comments[i];
      let replyCount = allReplyCounts[i];

      // And check to see if the action summaries we just computed match what is
      // currently set for the comments.
      let commentOperations = [];

      // If the reply count needs to be updated, then update it!
      if (comment.reply_count !== replyCount) {
        commentOperations.push({
          reply_count: replyCount,
        });
      }

      // If this comment has action summaries that should be updated, then
      // perform an update!
      if (commentOperations.length > 0) {
        operations.push({
          updateOne: {
            filter: {
              id: comment.id,
            },
            update: {
              $set: Object.assign({}, ...commentOperations),
            },
          },
        });
      }
    }

    debug(`Processed batch of ${comments.length} comments.`);

    if (operations.length >= limit) {
      debug(
        `Queued operations are ${
          operations.length
        }, reached limit of ${limit}, not processing any more.`
      );

      if (operations.length > limit) {
        debug(
          `${operations.length -
            limit} operations have been truncated to enforce the limit`
        );
      }

      break;
    }

    offset += batch;
  }

  const OPERATIONS_LENGTH = operations.length;

  if (limit < Infinity && offset + comments.length < totalCount) {
    console.log(
      `Processed ${offset +
        comments.length}/${totalCount} comments because we reached the update limit of ${limit}.`
    );
  } else {
    console.log(`Processed all ${totalCount} comments.`);
  }

  console.log(`${OPERATIONS_LENGTH} documents need fixing.`);

  // If fix was enabled, execute the batch writes.
  if (OPERATIONS_LENGTH > 0) {
    if (fix) {
      debug(`Fixing ${OPERATIONS_LENGTH} documents...`);

      while (operations.length) {
        let batchOperations = operations.splice(0, batch);
        let result = await CommentModel.collection.bulkWrite(batchOperations);

        debug(`Fixed batch of ${result.modifiedCount} documents.`);
      }

      console.log(`Applied all ${OPERATIONS_LENGTH} fixes.`);
    } else {
      console.warn(
        'Skipping fixing, --fix was not enabled, pass --fix to fix these errors'
      );
    }
  }
};
