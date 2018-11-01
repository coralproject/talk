import uuid from "uuid";

import { Config } from "talk-common/config";
import logger from "talk-server/logger";
import { User } from "talk-server/models/user";
import { Request } from "talk-server/types/express";

export interface CommonContextOptions {
  user?: User;
  req?: Request;
  config: Config;
}

export default class CommonContext {
  public readonly user?: User;
  public readonly req?: Request;
  public readonly config: Config;

  public readonly logger = logger.child({
    context: "graph",
    contextID: uuid.v4(),
  });

  constructor({ user, req, config }: CommonContextOptions) {
    this.user = user;
    this.req = req;
    this.config = config;
  }
}
