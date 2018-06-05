const debug = require('debug')('talk:services:migration');

/**
 * processUpdates processes batches of updates on the given model.
 *
 * @param {Object} model mongoose model that should perform the operations on
 * @param {Array<Object>} updates array of updates to execute
 */
const processUpdates = async (model, updates) => {
  // Create a new batch operation.
  const bulk = model.collection.initializeUnorderedBulkOp();

  for (const { query, update, replace } of updates) {
    if (update) {
      bulk.find(query).updateOne(update);
    } else if (replace) {
      bulk.find(query).replaceOne(replace);
    } else {
      throw new Error('invalid update object provided');
    }
  }

  // Execute the bulk update operation.
  await bulk.execute();
};

const debugProcessStatistics = (count, totalCount) => {
  if (totalCount > 0) {
    debug(
      `processed ${((count / totalCount) * 100).toFixed(
        2
      )}% (${count}/${totalCount}) updates`
    );
  } else {
    debug(`processed ${count} updates`);
  }
};

const transformSingleWithCursor = ({
  queryBatchSize,
  updateBatchSize,
}) => async (query, process, Model) => {
  debug('starting transform');

  // We'll manage the updates that we store inside this object.
  let updates = [];

  // Count the elements in the transformation.
  let totalCount = 0;
  try {
    totalCount = await query.count();
  } catch (err) {}

  // First we'll collect all the individual actions with specific group id's.
  const cursor = await query.batchSize(queryBatchSize);

  let count = 0;
  while (await cursor.hasNext()) {
    const result = await cursor.next();

    const transformed = await process(result);
    if (transformed) {
      updates.push(transformed);
    }

    if (updates.length > updateBatchSize) {
      // Process the updates.
      await processUpdates(Model, updates);
      count += updates.length;
      debugProcessStatistics(count, totalCount);

      // Clear the updates array.
      updates = [];
    }
  }

  if (updates.length > 0) {
    // Process the updates.
    await processUpdates(Model, updates);
    count += updates.length;
    debugProcessStatistics(count, totalCount);

    // Clear the updates array.
    updates = [];
  }

  debug('finished transform');
};

/**
 * processManyUpdates processes batches of updates on many models with the given
 * model.
 *
 * @param {Object} model mongoose model that should perform the operations on
 * @param {Array<Object>} updates array of updates to execute
 */
const processManyUpdates = async (model, updates) => {
  // Create a new batch operation.
  const bulk = model.collection.initializeUnorderedBulkOp();

  for (const { query, update } of updates) {
    bulk.find(query).update(update);
  }

  // Execute the bulk update operation.
  await bulk.execute();
};

module.exports = ctx => ({
  processManyUpdates,
  processUpdates,
  transformSingleWithCursor: transformSingleWithCursor(ctx),
});
