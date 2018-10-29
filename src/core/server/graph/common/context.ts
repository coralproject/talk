import { Config } from "talk-common/config";
import { User } from "talk-server/models/user";
import { Request } from "talk-server/types/express";

export interface CommonContextOptions {
  user?: User;
  req?: Request;
  config: Config;
}

export default class CommonContext {
  public user?: User;
  public req?: Request;
  public config: Config;

  constructor({ user, req, config }: CommonContextOptions) {
    this.user = user;
    this.req = req;
    this.config = config;
  }
}
