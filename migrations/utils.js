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

module.exports = { processUpdates };
