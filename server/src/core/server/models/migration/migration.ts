import { MongoContext } from "coral-server/data/context";

// eslint-disable-next-line no-shadow
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
  mongo: MongoContext,
  id: number,
  clientID: string,
  now = new Date()
) {
  const result = await mongo.migrations().findOneAndUpdate(
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
      returnDocument: "after",
      upsert: true,
    }
  );
  if (!result) {
    throw new Error("an unexpected error occurred");
  }

  return result;
}

/**
 * updateMigrationState will update the state of a migration record to reflect
 * the new state as well as un-setting the client ID from the records.
 * @param mongo the database to interact on
 * @param id the migration version to update
 * @param state the state to switch the record to
 * @param now the current date
 */
async function updateMigrationState(
  mongo: MongoContext,
  id: number,
  state: MIGRATION_STATE.FINISHED | MIGRATION_STATE.FAILED,
  now: Date
) {
  const result = await mongo.migrations().findOneAndUpdate(
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
      returnDocument: "after",
    }
  );

  return result;
}

export async function finishMigration(
  mongo: MongoContext,
  id: number,
  now = new Date()
) {
  return updateMigrationState(mongo, id, MIGRATION_STATE.FINISHED, now);
}

export async function failMigration(
  mongo: MongoContext,
  id: number,
  now = new Date()
) {
  return updateMigrationState(mongo, id, MIGRATION_STATE.FAILED, now);
}

export async function retrieveAllMigrationRecords(mongo: MongoContext) {
  const cursor = mongo.migrations().find({}).sort({ id: 1 });
  return cursor.toArray();
}
