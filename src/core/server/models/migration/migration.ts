import { Db } from "mongodb";

import { migrations as collection } from "coral-server/services/mongodb/collections";

import { createIndexFactory } from "../helpers";

export interface MigrationRecord {
  version: number;
  skipped?: boolean;
  createdAt: Date;
}

export async function createMigrationRecordIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collection(mongo));

  // UNIQUE { version }
  await createIndex({ version: 1 }, { unique: true });
}

export async function createMigrationRecord(
  mongo: Db,
  version: number,
  now = new Date()
) {
  await collection(mongo).insertOne({
    version,
    createdAt: now,
  });
}

export async function createSkippedMigrationRecords(
  mongo: Db,
  versions: number[],
  now = new Date()
) {
  await collection(mongo).insertMany(
    versions.map(version => ({
      version,
      skipped: true,
      createdAt: now,
    }))
  );
}

export async function retrieveAllMigrationRecords(mongo: Db) {
  const cursor = await collection(mongo)
    .find({})
    .sort({ version: 1 });
  return cursor.toArray();
}
