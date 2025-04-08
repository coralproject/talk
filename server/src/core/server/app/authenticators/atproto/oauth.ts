import http from "http";
(global as any).Response = http.ServerResponse;
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

  private readonly cookieStore: CookieStore;
  private readonly stateStore: StateStore;
  private readonly sessionStore: SessionStore;
  private readonly client: NodeOAuthClient;

  constructor({ callbackPath, clientName, clientSecret }: Options) {
    this.callbackPath = callbackPath;
    this.clientName = clientName;
    this.clientSecret = clientSecret;

    this.cookieStore = new CookieStore();
    this.stateStore = new StateStore(this.cookieStore);
    this.sessionStore = new SessionStore(this.cookieStore);
    this.client = new NodeOAuthClient({
      clientMetadata: {
        client_name: clientName,
        // client_id: clientID, //fix after working locally
        client_id: `http://localhost?redirect_uri=${enc(
          `http://127.0.0.1:3000/api/auth/bsky/callback`
        )}&scope=${enc("atproto transition:generic")}`,
        client_uri: "http://127.0.0.1:3000",
        redirect_uris: [`http://127.0.0.1:3000/api/auth/bsky/callback`],
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
    // attch this req/resp to the cookiestore
    this.cookieStore.req = req;
    this.cookieStore.resp = res;
    const handle = req.body.handle as string;

    // use these somewhere you need them later
    console.log(this.clientSecret, this.clientName, this.callbackPath);
    try {
      // redirect user to login
      const loginUrl: URL = await this.client.authorize(handle, {
        scope: "atproto transition:generic",
      });
      return loginUrl.href;
    } catch (err) {
      return err;
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
