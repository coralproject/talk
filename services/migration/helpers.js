/**
 * processUpdates processes batches of updates on the given model.
 *
 * @param {Object} model mongoose model that should perform the operations on
 * @param {Array<Object>} updates array of updates to execute
 */
const processUpdates = async (model, updates) => {
  // Create a new batch operation.
  const bulk = model.collection.initializeUnorderedBulkOp();

  for (const { query, update } of updates) {
    bulk.find(query).updateOne(update);
  }

  // Execute the bulk update operation.
  await bulk.execute();
};

const transformSingleWithCursor = ({
  queryBatchSize,
  updateBatchSize,
}) => async (cursor, process, Model) => {
  // We'll manage the updates that we store inside this object.
  let updates = [];

  // First we'll collect all the individual actions with specific group id's.
  cursor = await cursor.batchSize(queryBatchSize);

  while (await cursor.hasNext()) {
    const result = await cursor.next();

    const transformed = await process(result);
    if (transformed) {
      updates.push(transformed);
    }

    if (updates.length > updateBatchSize) {
      // Process the updates.
      await processUpdates(Model, updates);

      // Clear the updates array.
      updates = [];
    }
  }

  if (updates.length > 0) {
    // Process the updates.
    await processUpdates(Model, updates);

    // Clear the updates array.
    updates = [];
  }
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
