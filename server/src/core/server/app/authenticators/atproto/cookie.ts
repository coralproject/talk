import cookie from "cookie";

import { Request, TenantCoralRequest } from "coral-server/types/express";
import { Response } from "express";

import type {
  NodeSavedSession,
  NodeSavedState,
} from "@atproto/oauth-client-node";

export function saveCookie(
  res: Response,
  data: any,
  key: string,
  secure: boolean
) {
  res.cookie(key, data, {
    httpOnly: true,
    secure,
  });

  return;
}

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
    // saveCookie(this.resp, data, key, false);
    return;
  }

  public async setSessionCookie(key: string, session: NodeSavedSession) {
    const data = JSON.stringify(session);
    this.resp.cookie(key, data);
  }

  public async retrieveCookie(key: string) {
    const header = this.req.headers.cookie;
    if (typeof header === "string") {
      const cookies = cookie.parse(header);
      const atprotoCookie = cookies[key];
      if (!atprotoCookie || typeof atprotoCookie !== "string") {
        throw new Error("missing atproto cookie");
      } else {
        return JSON.parse(atprotoCookie.valueOf());
      }
    }
    throw new Error("no cookies found");
  }

  public async getStateFromCookie(key: string) {
    const state = await this.retrieveCookie(key);
    return state;
  }

  public async getSessionFromCookie(key: string) {
    const session = await this.retrieveCookie(key);
    return session;
  }

  public async deleteCookie(key: string) {
    this.resp.clearCookie(key);
  }
}
