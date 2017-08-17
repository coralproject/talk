const CommentModel = require('../../../models/comment');
const ActionsService = require('../../../services/actions');
const {arrayJoinBy} = require('../../../graph/loaders/util');
const sc = require('snake-case');

const getBatch = async (limit, offset) => CommentModel
  .find({})
  .select({'id': 1, 'action_counts': 1})
  .limit(limit)
  .skip(offset)
  .sort('created_at');

module.exports = async ({fix = false, batch = 1000}) => {
  let operations = [];

  // Count how many comments there are to process.
  const totalCount = await CommentModel.count();

  let offset = 0;
  let comments = [];
  let commentIDs = [];

  console.log(`Processing ${totalCount} comments...`);

  // Keep processing documents until there are is none left.
  while (offset < totalCount) {

    // Get a batch of comments.
    comments = await getBatch(batch, offset);
    commentIDs = comments.map(({id}) => id);

    // Get their action summaries.
    let allActionSummaries = await ActionsService
      .getActionSummaries(commentIDs)
      .then(arrayJoinBy(commentIDs, 'item_id'));

    // Loop over the comments, with their action summaries.
    for (let i = 0; i < comments.length; i++) {
      let comment = comments[i];
      let actionSummaries = allActionSummaries[i];

      // And check to see if the action summaries we just computed match what is
      // currently set for the comments.
      let commentOperations = [];

      // First we process all the group id's.
      for (let actionSummary of actionSummaries) {
        if (actionSummary.group_id === null) {
          continue;
        }

        const ACTION_TYPE = sc(actionSummary.action_type.toLowerCase());
        const GROUP_ID = sc(actionSummary.group_id.toLowerCase());

        if (GROUP_ID.length <= 0) {
          continue;
        }

        const ACTION_COUNT_FIELD = `${ACTION_TYPE}_${GROUP_ID}`;

        // Check that the action summaries match the cached counts.
        if (!comment.action_counts || !(ACTION_COUNT_FIELD in comment.action_counts) || comment.action_counts[ACTION_COUNT_FIELD] !== actionSummary.count) {

          // Batch updates for those changes.
          commentOperations.push({
            [`action_counts.${ACTION_COUNT_FIELD}`]: actionSummary.count,
          });
        }
      }

      // Group all the action summaries together from all the different group
      // ids.
      let groupedActionSummaries = actionSummaries.reduce((acc, actionSummary) => {
        const ACTION_TYPE = sc(actionSummary.action_type.toLowerCase());

        if (!(ACTION_TYPE in acc)) {
          acc[ACTION_TYPE] = 0;
        }

        acc[ACTION_TYPE] += actionSummary.count;

        return acc;
      }, {});

      Object.keys(groupedActionSummaries).forEach((ACTION_COUNT_FIELD) => {
        const count = groupedActionSummaries[ACTION_COUNT_FIELD];

        // Check that the action summaries match the cached counts.
        if (!comment.action_counts || !(ACTION_COUNT_FIELD in comment.action_counts) || comment.action_counts[ACTION_COUNT_FIELD] !== count) {

            // Batch updates for those changes.
          commentOperations.push({
            [`action_counts.${ACTION_COUNT_FIELD}`]: count,
          });
        }
      });

      // If this comment has action summaries that should be updated, then
      // perform an update!
      if (commentOperations.length > 0) {
        operations.push({
          updateOne: {
            filter: {
              id: comment.id
            },
            update: {
              $set: Object.assign({}, ...commentOperations),
            },
          },
        });
      }
    }

    console.log(`Processed batch of ${comments.length} comments.`);

    offset += batch;
  }

  const OPERATIONS_LENGTH = operations.length;

  console.log(`Processed all ${totalCount} comments.`);
  console.log(`${OPERATIONS_LENGTH} documents need fixing.`);

  // If fix was enabled, execute the batch writes.
  if (OPERATIONS_LENGTH > 0) {
    if (fix) {
      console.log(`Fixing ${OPERATIONS_LENGTH} documents...`);

      while (operations.length) {
        let batchOperations = operations.splice(0, batch);
        let result = await CommentModel.collection.bulkWrite(batchOperations);

        console.log(`Fixed batch of ${result.modifiedCount} documents.`);
      }

      console.log(`Fixed all ${OPERATIONS_LENGTH} documents.`);
    } else {
      console.warn('Skipping fixing, --fix was not enabled, pass --fix to fix these errors');
    }
  }
};
