import { Db } from "mongodb";
import CommonContext from "talk-server/graph/common/context";

export interface ManagementContextOptions {
  mongo: Db;
}

export default class ManagementContext extends CommonContext {
  public mongo: Db;

  constructor({ mongo }: ManagementContextOptions) {
    super({});

    this.mongo = mongo;
  }
}
