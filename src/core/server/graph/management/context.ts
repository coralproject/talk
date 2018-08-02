import { Db } from "mongodb";

import CommonContext from "talk-server/graph/common/context";
import { Request } from "talk-server/types/express";

export interface ManagementContextOptions {
  mongo: Db;
  req?: Request;
}

export default class ManagementContext extends CommonContext {
  public mongo: Db;

  constructor({ req, mongo }: ManagementContextOptions) {
    super({ req });

    this.mongo = mongo;
  }
}
