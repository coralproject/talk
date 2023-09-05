import { Db, MongoClient } from "mongodb";

import { WrappedInternalError } from "coral-server/errors";
import logger from "coral-server/logger";

async function createMongoClient(mongoURI: string): Promise<MongoClient> {
  try {
    return await MongoClient.connect(mongoURI, {
      useNewUrlParser: true,
      ignoreUndefined: true,
    });
  } catch (err) {
    throw new WrappedInternalError(err, "could not connect to mongodb");
  }
}

function attachHandlers(db: Db) {
  db.on("error", (err: Error) => {
    logger.error({ err }, "mongodb has encountered an error");
  });
  db.on("close", () => {
    logger.warn("mongodb has closed");
  });
  db.on("reconnect", () => {
    logger.warn("mongodb has reconnected");
  });
  db.on("timeout", () => {
    logger.warn("mongodb has timed out");
  });
}

/**
 * create will connect to the MongoDB instance identified in the configuration.
 *
 * @param config application configuration.
 */
export async function createMongoDB(mongoURI: string): Promise<Db> {
  // Connect and create a client for MongoDB.
  const client = await createMongoClient(mongoURI);

  logger.info("mongodb has connected");

  // Return the database handle, which defaults to the database name provided
  // in the config connection string.
  const db = client.db();

  // Attach the handlers.
  attachHandlers(db);

  return db;
}
