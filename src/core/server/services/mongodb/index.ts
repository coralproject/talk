import { Db, MongoClient } from "mongodb";

import { Config } from "talk-server/config";
import { InternalError } from "talk-server/errors";

export async function createMongoClient(config: Config): Promise<MongoClient> {
  try {
    return await MongoClient.connect(config.get("mongodb"), {
      useNewUrlParser: true,
    });
  } catch (err) {
    throw new InternalError(err, "could not connect to mongodb");
  }
}

/**
 * create will connect to the MongoDB instance identified in the configuration.
 *
 * @param config application configuration.
 */
export async function createMongoDB(config: Config): Promise<Db> {
  // Connect and create a client for MongoDB.
  const client = await createMongoClient(config);

  // Return the database handle, which defaults to the database name provided
  // in the config connection string.
  return client.db();
}
