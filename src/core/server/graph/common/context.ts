import { User } from "talk-server/models/user";
import { Request } from "talk-server/types/express";

export interface CommonContextOptions {
  user?: User;
  req?: Request;
}

export default class CommonContext {
  public user?: User;
  public req?: Request;

  constructor({ user, req }: CommonContextOptions) {
    this.user = user;
    this.req = req;
  }
}
