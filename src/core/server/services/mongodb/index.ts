import { Db, MongoClient } from "mongodb";

import { Config } from "coral-server/config";
import { WrappedInternalError } from "coral-server/errors";
import logger from "coral-server/logger";

async function createMongoClient(config: Config): Promise<MongoClient> {
  try {
    return await MongoClient.connect(config.get("mongodb"), {
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
export async function createMongoDB(config: Config): Promise<Db> {
  // Connect and create a client for MongoDB.
  const client = await createMongoClient(config);

  logger.info("mongodb has connected");

  // Return the database handle, which defaults to the database name provided
  // in the config connection string.
  const db = client.db();

  // Attach the handlers.
  attachHandlers(db);

  return db;
}
