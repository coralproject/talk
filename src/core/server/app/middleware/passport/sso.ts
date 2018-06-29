import { Strategy } from "passport-strategy";

import { Request } from "talk-server/types/express";

export default class SSOStrategy extends Strategy {
  public async authenticate(req: Request) {
    return;
  }
}
