import { Db } from "mongodb";

export interface ManagementContextOptions {
  db: Db;
}

export default class ManagementContext {
  public db: Db;

  constructor({ db }: ManagementContextOptions) {
    this.db = db;
  }
}
