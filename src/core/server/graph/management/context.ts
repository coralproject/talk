import { Db } from "mongodb";
import CommonContext from "talk-server/graph/common/context";

export interface ManagementContextOptions {
  db: Db;
}

export default class ManagementContext extends CommonContext {
  public db: Db;

  constructor({ db }: ManagementContextOptions) {
    super({});

    this.db = db;
  }
}
