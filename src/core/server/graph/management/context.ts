import { Db } from "mongodb";

import { Config } from "talk-server/config";
import CommonContext from "talk-server/graph/common/context";
import { I18n } from "talk-server/services/i18n";
import { Request } from "talk-server/types/express";

export interface ManagementContextOptions {
  mongo: Db;
  config: Config;
  i18n: I18n;
  req?: Request;
}

export default class ManagementContext extends CommonContext {
  public readonly mongo: Db;

  constructor({ req, mongo, config, i18n }: ManagementContextOptions) {
    super({ req, config, i18n });

    this.mongo = mongo;
  }
}
