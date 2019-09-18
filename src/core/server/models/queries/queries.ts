import { OperationTypeNode } from "graphql";
import { Db } from "mongodb";

import {
  createCollection,
  createIndexFactory,
} from "coral-server/models/helpers";

const collection = createCollection<Readonly<PersistedQuery>>("queries");

export interface PersistedQuery {
  id: string;
  operation: OperationTypeNode;
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

  // Execute the bulk operations.
  await bulk.execute();
}

export async function getQueries(mongo: Db, ids: string[]) {
  const cursor = await collection(mongo).find({ id: { $in: ids } });
  const queries = await cursor.toArray();
  return ids.map(id => queries.find(query => query.id === id) || null);
}
