import { Db, MongoClient } from "mongodb";

export interface MongoContext {
  db: Db;
  client: MongoClient;
}

export const createMongo = async (
  uri: string,
  dbName: string
): Promise<MongoContext> => {
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);

  return {
    db,
    client,
  };
};
