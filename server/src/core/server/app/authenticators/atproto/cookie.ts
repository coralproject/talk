import cookie from "cookie";

import { Request, TenantCoralRequest } from "coral-server/types/express";
import { Response } from "express";

import type {
  NodeSavedSession,
  NodeSavedState,
} from "@atproto/oauth-client-node";

// export function saveCookie(
//   req: Request,
//   res: Response,
//   data: any,
//   secure: boolean
// ) {
//   const name = "atproto:oauth";

//   res.cookie(name, data, {
//     httpOnly: true,
//     secure,
//   });

//   return;
// }

export class CookieStore {
  public req: Request<TenantCoralRequest>;
  public resp: Response;

  public attach(req: Request<TenantCoralRequest>, res: Response) {
    this.req = req;
    this.resp = res;
  }

  public async setStateCookie(key: string, state: NodeSavedState) {
    const data = JSON.stringify(state);
    this.resp.cookie(key, data); // add back cookie secure options if this works
  }

  public async setSessionCookie(key: string, session: NodeSavedSession) {
    const data = JSON.stringify(session);
    this.resp.cookie(key, data);
  }

  public async retrieveCookie(key: string) {
    const header = this.req.headers.cookie;
    if (typeof header === "string") {
      const cookies = cookie.parse(header);
      if (cookies.keys.includes(key)) {
        return JSON.parse(cookies[key]);
      }
    }
    throw new Error("missing atproto cookie");
  }

  public async getStateFromCookie(key: string) {
    const state = await this.retrieveCookie(key);
    return state as NodeSavedState;
  }

  public async getSessionFromCookie(key: string) {
    const session = await this.retrieveCookie(key);
    return session as NodeSavedSession;
  }

  public async deleteCookie(key: string) {
    this.resp.clearCookie(key);
  }
}
