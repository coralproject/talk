// import { Response } from "express";
import http from "http";
(global as any).Response = http.ServerResponse;
import { Agent } from "@atproto/api";
import { NodeOAuthClient } from "@atproto/oauth-client-node";
import cookie from "cookie";
import { stringifyQuery } from "coral-common/common/lib/utils";
import { WrappedInternalError } from "coral-server/errors";
import logger from "coral-server/logger";
import { User } from "coral-server/models/user";
import { JWTSigningConfig, signTokenString } from "coral-server/services/jwt";
import {
  Request,
  RequestHandler,
  TenantCoralRequest,
} from "coral-server/types/express";
import { Response } from "express";

import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from "@atproto/oauth-client-node";

const enc = encodeURIComponent;

export function redirectWithHash(
  res: Response,
  redirectTo: string,
  hash: Record<string, any>
) {
  res.redirect(`${redirectTo}${stringifyQuery(hash, "#")}`);
}

interface Options {
  callbackPath: string;
  clientID: string;
  clientName: string;
  clientURI: string;
}

class CookieStore {
  public req: Request<TenantCoralRequest>;
  public resp: Response;

  async setStateCookie(key: string, state: NodeSavedState) {
    const data = JSON.stringify(state);
    this.resp.cookie(key, data); // add back cookie secure options if this works
  }

  async setSessionCookie(key: string, session: NodeSavedSession) {
    const data = JSON.stringify(session);
    this.resp.cookie(key, data);
  }

  async retrieveCookie(key: string) {
    const header = this.req.headers.cookie;
    if (typeof header === "string") {
      const cookies = cookie.parse(header);
      if (cookies.keys.includes(key)) {
        return JSON.parse(cookies[key]);
      }
    }
    throw new Error("missing atproto cookie");
  }

  async getStateFromCookie(key: string) {
    const state = await this.retrieveCookie(key);
    return state as NodeSavedState;
  }

  async getSessionFromCookie(key: string) {
    const session = await this.retrieveCookie(key);
    return session as NodeSavedSession;
  }

  async deleteCookie(key: string) {
    this.resp.clearCookie(key);
  }
}

class StateStore implements NodeSavedStateStore {
  // async get, set and del - called by client.authorize()
  constructor(private store: any) {}
  async get(key: string): Promise<NodeSavedState | undefined> {
    const state = await this.store.getStateFromCookie(key);
    return state as NodeSavedState;
  }
  async set(key: string, state: NodeSavedState) {
    await this.store.setStateCookie(key, state);
  }
  async del(key: string) {
    await this.store.deleteCookie(key);
  }
}

class SessionStore implements NodeSavedSessionStore {
  constructor(private store: any) {}
  async get(key: string): Promise<NodeSavedSession | undefined> {
    const session = await this.store.getSessionFromCookie(key);
    return session as NodeSavedSession;
  }
  async set(key: string, session: NodeSavedSession) {
    await this.store.setSessionCookie(key, session);
  }
  async del(key: string) {
    await this.store.deleteCookie(key);
  }
}

export abstract class AtprotoOauthAuthenticator {
  private readonly signingConfig: JWTSigningConfig;
  private readonly callbackPath: string;
  private readonly clientID: string;
  private readonly clientName: string;
  private readonly clientURI: string;

  private readonly cookieStore: CookieStore;
  private readonly stateStore: NodeSavedStateStore;
  private readonly sessionStore: NodeSavedSessionStore;
  private readonly client: NodeOAuthClient;

  constructor({ callbackPath, clientID, clientName, clientURI }: Options) {
    this.callbackPath = callbackPath;
    this.clientID = clientID;
    this.clientName = clientName;
    this.clientURI = clientURI;

    this.cookieStore = new CookieStore();
    this.stateStore = new StateStore(this.cookieStore);
    this.sessionStore = new SessionStore(this.cookieStore);
    this.client = new NodeOAuthClient({
      clientMetadata: {
        client_name: clientName,
        // client_id: clientID, //fix after working locally
        client_id: `http://localhost?redirect_uri=${enc(
          `http://127.0.0.1:3000/bsky/callback`
        )}&scope=${enc("atproto transition:generic")}`,
        client_uri: "http://127.0.0.1:3000",
        redirect_uris: [`http://127.0.0.1:3000/bsky/callback`],
        scope: "atproto transition:generic",
        grant_types: ["authorization_code", "refresh_token"],
        response_types: ["code"],
        application_type: "web",
        token_endpoint_auth_method: "none",
        dpop_bound_access_tokens: true,
      },
      sessionStore: this.sessionStore,
      stateStore: this.stateStore,
    });
  }

  public abstract authenticate: RequestHandler<
    TenantCoralRequest,
    Promise<void>
  >;

  protected async callAuthorize(
    handle: string,
    req: Request<TenantCoralRequest>,
    res: Response
  ) {
    // attch this req/resp to the cookiestore
    this.cookieStore.req = req;
    this.cookieStore.resp = res;

    // use these somewhere you need them later
    console.log(
      this.clientID,
      this.clientName,
      this.clientURI,
      this.callbackPath
    );

    // redirect user to login
    const loginUrl: URL = await this.client.authorize(handle, {
      scope: "atproto transition:generic",
    });
    if (loginUrl) {
      return loginUrl.href;
    } else {
      throw new Error("authorize request failed");
    }
  }
  // you need a Helper function to get the Atproto Agent for the active session before you can hook up a callback
  protected async getSessionAgent(params: URLSearchParams) {
    const { session } = await this.client.callback(params);
    const agent = new Agent(session);
    return agent;
  }

  protected async success(
    redirectTo: string,
    user: Readonly<User>,
    req: Request<TenantCoralRequest>,
    res: Response
  ) {
    const { tenant, now } = req.coral;
    try {
      // Create a new token for the user.
      const accessToken = await signTokenString(
        this.signingConfig,
        user,
        tenant,
        {},
        now
      );
      return redirectWithHash(res, redirectTo, { accessToken });
    } catch (err) {
      return this.fail(redirectTo, err as Error, req, res);
    }
  }

  protected fail(
    redirectTo: string,
    err: Error,
    req: Request<TenantCoralRequest>,
    res: Response
  ) {
    const error = new WrappedInternalError(
      err,
      "an authentication error occured"
    );
    logger.error({ err }, "an authentication error occurred for a user");

    return redirectWithHash(res, redirectTo, { error: error.message });
  }
}
