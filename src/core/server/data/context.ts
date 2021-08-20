import { Db } from "mongodb";

export interface MongoContext {
  readonly main: Db;
  readonly archive: Db;
}
