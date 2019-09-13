import { Db, MongoError } from "mongodb";

import {
  createCollection,
  createIndexFactory,
} from "coral-server/models/helpers";

const collection = createCollection<Readonly<PersistedQuery>>("queries");

export interface PersistedQuery {
  id: string;
  operation: string;
  operationName: string;
  query: string;
  bundle: string;
  version: string;
}

export async function createQueriesIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collection(mongo));

  // UNIQUE { id }
  await createIndex({ id: 1 }, { unique: true });
}

export async function primeQueries(mongo: Db, queries: PersistedQuery[]) {
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
      // The error was due to a race causing a duplicate insert, we should retry
      // this operation.
      await bulk.execute({ w: "majority" });

      return;
    }

    throw err;
  }
}

export async function getQueries(mongo: Db, ids: string[]) {
  const cursor = await collection(mongo).find({ id: { $in: ids } });
  const queries = await cursor.toArray();
  return ids.map(id => queries.find(query => query.id === id) || null);
}
