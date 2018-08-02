import { User } from "talk-server/models/user";

export interface CommonContextOptions {
  user?: User;
}

export default class CommonContext {
  public user?: User;

  constructor({ user }: CommonContextOptions) {
    this.user = user;
  }
}
