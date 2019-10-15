import { Db } from "mongodb";

import { migrations as collection } from "coral-server/services/mongodb/collections";

export enum MIGRATION_STATE {
  STARTED = "STARTED",
  FAILED = "FAILED",
  FINISHED = "FINISHED",
}

export interface MigrationRecord {
  id: number;
  state: MIGRATION_STATE;
  clientID?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export async function startMigration(
  mongo: Db,
  id: number,
  clientID: string,
  now = new Date()
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      $setOnInsert: {
        id,
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
 * @param id the migration version to update
 * @param state the state to switch the record to
 * @param now the current date
 */
async function updateMigrationState(
  mongo: Db,
  id: number,
  state: MIGRATION_STATE.FINISHED | MIGRATION_STATE.FAILED,
  now: Date
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id },
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

export async function finishMigration(mongo: Db, id: number, now = new Date()) {
  return updateMigrationState(mongo, id, MIGRATION_STATE.FINISHED, now);
}

export async function failMigration(mongo: Db, id: number, now = new Date()) {
  return updateMigrationState(mongo, id, MIGRATION_STATE.FAILED, now);
}

export async function retrieveAllMigrationRecords(mongo: Db) {
  const cursor = collection(mongo)
    .find({})
    .sort({ id: 1 });
  return cursor.toArray();
}
