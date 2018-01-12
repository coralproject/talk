const UserModel = require('../../../models/user');
const CommentModel = require('../../../models/comment');
const ActionsService = require('../../../services/actions');
const { arrayJoinBy } = require('../../../graph/loaders/util');
const { get } = require('lodash');
const debug = require('debug')('talk:cli:verify');

const MODELS = [UserModel, CommentModel];

async function processBatch(Model, documents) {
  // Get an array of all the document id's.
  const documentIDs = documents.map(({ id }) => id);

  // Store all the operations on this batch in this array that we'll return
  // later.
  const operations = [];

  // Get the action summaries for this batch.
  const totalActionSummaries = await ActionsService.getActionSummaries(
    documentIDs
  ).then(arrayJoinBy(documentIDs, 'item_id'));

  // Iterate over the documents.
  for (let i = 0; i < documents.length; i++) {
    const document = documents[i];
    const actionSummaries = totalActionSummaries[i];

    let ops = [];

    for (const actionSummary of actionSummaries) {
      if (actionSummary.group_id === null) {
        continue;
      }

      // And we generate the group id.
      const ACTION_TYPE = actionSummary.action_type.toLowerCase();
      const GROUP_ID = actionSummary.group_id.toLowerCase();

      if (GROUP_ID.length <= 0) {
        continue;
      }

      // And we add a new batch operation if the action summary is associated
      // with a group.
      const ACTION_COUNT_FIELD = `${ACTION_TYPE}_${GROUP_ID}`;

      // Check that the action summaries match the cached counts.
      if (
        get(document, ['action_counts', ACTION_COUNT_FIELD]) !==
        actionSummary.count
      ) {
        // Batch updates for those changes.
        ops.push({
          [`action_counts.${ACTION_COUNT_FIELD}`]: actionSummary.count,
        });
      }
    }

    // Group all the action summaries together from all the different group
    // ids.
    const groupedActionSummaries = actionSummaries.reduce(
      (acc, actionSummary) => {
        // action_type is already snake cased (as it would have had to be when it
        // was inserted in the database).
        const ACTION_TYPE = actionSummary.action_type.toLowerCase();

        if (!(ACTION_TYPE in acc)) {
          acc[ACTION_TYPE] = 0;
        }

        acc[ACTION_TYPE] += actionSummary.count;

        return acc;
      },
      {}
    );

    for (const ACTION_COUNT_FIELD of Object.keys(groupedActionSummaries)) {
      const count = groupedActionSummaries[ACTION_COUNT_FIELD];

      // Check that the action summaries match the cached counts.
      if (get(document, ['action_counts', ACTION_COUNT_FIELD]) !== count) {
        // Batch updates for those changes.
        ops.push({
          [`action_counts.${ACTION_COUNT_FIELD}`]: count,
        });
      }
    }

    // If this comment has action summaries that should be updated, then
    // perform an update!
    if (ops.length > 0) {
      operations.push({
        updateOne: {
          filter: {
            id: document.id,
          },
          update: {
            $set: Object.assign({}, ...ops),
          },
        },
      });
    }
  }

  return operations;
}

module.exports = async ({ fix, batch }) => {
  for (const Model of MODELS) {
    const cursor = Model.collection
      .find({})
      .project({
        id: 1,
        action_counts: 1,
      })
      .sort({ created_at: 1 });

    let operations = [];
    let documents = [];

    // While there are documents to process.
    while (await cursor.hasNext()) {
      // Load the document.
      const document = await cursor.next();

      // Push the document into the documents array.
      documents.push(document);

      // Check to see if the length of the documents array requires us to
      // process it.
      if (documents.length > batch) {
        // Process this batch.
        let batchOperations = await processBatch(Model, documents);

        // Push the batch operations into the model operations.
        operations.push(...batchOperations);

        // Clear this batch contents.
        documents = [];
      }
    }

    // Check to see if there are any documents left over.
    if (documents.length > 0) {
      // Process this batch.
      let batchOperations = await processBatch(Model, documents);

      // Push the batch operations into the model operations.
      operations.push(...batchOperations);
    }

    const OPERATIONS_LENGTH = operations.length;

    console.log(
      `action_counts.js: ${OPERATIONS_LENGTH} ${
        Model.collection.name
      } need their action counts fixed.`
    );

    // If fix was enabled, execute the batch writes.
    if (OPERATIONS_LENGTH > 0) {
      if (fix) {
        debug(
          `action_counts.js: fixing ${OPERATIONS_LENGTH} ${
            Model.collection.name
          }...`
        );

        while (operations.length) {
          let result = await Model.collection.bulkWrite(
            operations.splice(0, batch)
          );

          debug(
            `action_counts.js: fixed batch of ${result.modifiedCount} ${
              Model.collection.name
            }.`
          );
        }

        console.log(
          `action_counts.js: applied all ${OPERATIONS_LENGTH} fixes to ${
            Model.collection.name
          }.`
        );
      } else {
        console.warn(
          'Skipping fixing, --fix was not enabled, pass --fix to fix these errors'
        );
      }
    }
  }
};
