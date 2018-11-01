import { Db } from "mongodb";

import { Config } from "talk-common/config";
import CommonContext from "talk-server/graph/common/context";
import { Request } from "talk-server/types/express";

export interface ManagementContextOptions {
  mongo: Db;
  config: Config;
  req?: Request;
}

export default class ManagementContext extends CommonContext {
  public readonly mongo: Db;

  constructor({ req, mongo, config }: ManagementContextOptions) {
    super({ req, config });

    this.mongo = mongo;
  }
}
