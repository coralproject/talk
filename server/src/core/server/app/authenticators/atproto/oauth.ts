import { Agent } from "@atproto/api";
import { NodeOAuthClient } from "@atproto/oauth-client-node";
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

// Overide fetch for @atproto/oauth-client-node client.authorize to work
(global as any).fetch = fetch;

import { CookieStore } from "./cookie";
import { SessionStore } from "./session";
import { StateStore } from "./state";

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
  clientName: string;
  clientSecret: string;
}

export abstract class AtprotoOauthAuthenticator {
  private readonly signingConfig: JWTSigningConfig;
  private readonly callbackPath: string;
  private readonly clientName: string;
  private readonly clientSecret: string;
  private readonly clientID: string;

  public readonly cookieStore: CookieStore;
  public readonly stateStore: StateStore;
  public readonly sessionStore: SessionStore;
  public readonly client: NodeOAuthClient;

  constructor({ callbackPath, clientName, clientSecret }: Options) {
    this.callbackPath = callbackPath;
    this.clientName = clientName;
    this.clientSecret = clientSecret;
    // must use localhost for dev, update after working locally
    this.clientID = `http://localhost?redirect_uri=${enc(
      `http://127.0.0.1:3000${this.callbackPath}`
    )}&scope=${enc("atproto transition:generic")}`;
    // this.clientID = `${tenantDomain}?redirect_uri=${enc(
    //   `http://127.0.0.1:3000${this.callbackPath}`
    // )}&scope=${enc("atproto transition:generic")}`;

    this.cookieStore = new CookieStore();
    this.stateStore = new StateStore(this.cookieStore);
    this.sessionStore = new SessionStore(this.cookieStore);
    this.client = new NodeOAuthClient({
      clientMetadata: {
        client_name: this.clientName,
        client_id: this.clientID,
        client_uri: "http://127.0.0.1:3000", // update to tenant after working locally
        redirect_uris: [`http://127.0.0.1:3000${this.callbackPath}`], // update to tenant after working locally
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

  public abstract metadata: RequestHandler<TenantCoralRequest, Promise<void>>;

  protected getClientMetadata() {
    return this.client.clientMetadata;
  }

  protected async callAuthorize(
    req: Request<TenantCoralRequest>,
    res: Response
  ) {
    // attach this req/resp to the cookiestore
    this.cookieStore.attach(req, res);
    const handle = req.body.handle as string;

    // use this to make jwt secrets, you need it later
    console.log(this.clientSecret);
    try {
      // redirect user to login
      const loginUrl: URL = await this.client.authorize(handle, {
        scope: "atproto transition:generic",
      });
      return loginUrl.href;
    } catch (err) {
      return new Error(`${err.message || "unable to authorize handle"}`);
    }
  }
  // you need a Helper function to handle session refresh from the Atproto Agent
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
