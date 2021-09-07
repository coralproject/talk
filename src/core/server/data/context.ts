import { Db } from "mongodb";

export interface MongoContext {
  readonly live: Db;
  readonly archive?: Db;
}
