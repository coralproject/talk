import { Db } from "mongodb";

import { migrations as collection } from "coral-server/services/mongodb/collections";

import { createIndexFactory } from "../helpers";

export enum MIGRATION_STATE {
  STARTED = "STARTED",
  FAILED = "FAILED",
  FINISHED = "FINISHED",
}

export interface MigrationRecord {
  version: number;
  state: MIGRATION_STATE;
  clientID?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export async function createMigrationRecordIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collection(mongo));

  // UNIQUE { version }
  await createIndex({ version: 1 }, { unique: true });
}

export async function startMigration(
  mongo: Db,
  version: number,
  clientID: string,
  now = new Date()
) {
  const result = await collection(mongo).findOneAndUpdate(
    { version },
    {
      $setOnInsert: {
        version,
        clientID,
        state: MIGRATION_STATE.STARTED,
        createdAt: now,
      },
    },
    {
      // False to return the updated document instead of the original document.
      returnOriginal: false,
      upsert: true,
    }
  );
  if (!result.value) {
    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

/**
 * updateMigrationState will update the state of a migration record to reflect
 * the new state as well as un-setting the client ID from the records.
 *
 * @param mongo the database to interact on
 * @param version the migration version to update
 * @param state the state to switch the record to
 * @param now the current date
 */
async function updateMigrationState(
  mongo: Db,
  version: number,
  state: MIGRATION_STATE.FINISHED | MIGRATION_STATE.FAILED,
  now: Date
) {
  const result = await collection(mongo).findOneAndUpdate(
    { version },
    {
      $set: {
        state,
        updatedAt: now,
      },
      $unset: {
        clientID: "",
      },
    },
    {
      // False to return the updated document instead of the original document.
      returnOriginal: false,
    }
  );

  return result.value || null;
}

export async function finishMigration(
  mongo: Db,
  version: number,
  now = new Date()
) {
  return updateMigrationState(mongo, version, MIGRATION_STATE.FINISHED, now);
}

export async function failMigration(
  mongo: Db,
  version: number,
  now = new Date()
) {
  return updateMigrationState(mongo, version, MIGRATION_STATE.FAILED, now);
}

export async function retrieveAllMigrationRecords(mongo: Db) {
  const cursor = await collection(mongo)
    .find({})
    .sort({ version: 1 });
  return cursor.toArray();
}
