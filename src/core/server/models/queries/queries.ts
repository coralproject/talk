import { OperationTypeNode } from "graphql";
import { Db, MongoError } from "mongodb";

import { waitFor } from "coral-common/helpers";
import logger from "coral-server/logger";
import { queries as collection } from "coral-server/services/mongodb/collections";

export interface PersistedQuery {
  id: string;
  operation: OperationTypeNode;
  operationName: string;
  query: string;
  bundle: string;
  version: string;
}

export async function primeQueries(
  mongo: Db,
  queries: PersistedQuery[],
  tries = 1
) {
  // Setup persisting these queries.
  const bulk = collection(mongo).initializeUnorderedBulkOp({});

  // Upsert each query.
  for (const query of queries) {
    const { id } = query;

    // Add to the bulk operation for MongoDB.
    bulk
      .find({ id })
      .upsert()
      .replaceOne(query);
  }

  try {
    // Execute the bulk operations.
    await bulk.execute({ w: "majority" });

    return;
  } catch (err) {
    if (err instanceof MongoError && err.code === 11000) {
      if (tries > 2) {
        logger.warn(
          { err, tries },
          "duplicate error on inserting persisted queries after maximum tries reached"
        );
        return;
      }

      // Wait for 500ms before trying again.
      await waitFor(500);

      // Retry the priming operation.
      await primeQueries(mongo, queries, tries + 1);
    }

    // An error unrelated to duplicate indexes was thrown, just rethrow it.
    throw err;
  }
}

export async function getQueries(mongo: Db, ids: string[]) {
  const cursor = await collection(mongo).find({ id: { $in: ids } });
  const queries = await cursor.toArray();
  return ids.map(id => queries.find(query => query.id === id) || null);
}
