import { MongoClient, Db } from "mongodb";
import { Config } from "talk-server/config";

/**
 * create will connect to the MongoDB instance identified in the configuration.
 *
 * @param config application configuration.
 */
export async function createMongoDB(config: Config): Promise<Db> {
  // Connect and create a client for MongoDB.
  const client = await MongoClient.connect(config.get("mongodb"));

  // Return the database handle, which defaults to the database name provided
  // in the config connection string.
  return client.db();
}
