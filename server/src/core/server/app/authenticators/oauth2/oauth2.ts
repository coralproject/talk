import { Response } from "express";
import { merge } from "lodash";
import { OAuth2 } from "oauth";

import { stringifyQuery } from "coral-common/utils";
import { reconstructURL } from "coral-server/app/url";
import { Config } from "coral-server/config";
import { WrappedInternalError } from "coral-server/errors";
import logger from "coral-server/logger";
import { User } from "coral-server/models/user";
import { JWTSigningConfig, signTokenString } from "coral-server/services/jwt";
import {
  Request,
  RequestHandler,
  TenantCoralRequest,
} from "coral-server/types/express";

import { StateData, storeState, verifyState } from "./state";

export function redirectWithHash(
  res: Response,
  state: StateData,
  hash: Record<string, any>
) {
  res.redirect(`${state.redirectTo}${stringifyQuery(hash, "#")}`);
}

function createOAuthError(
  message: string,
  err: { statusCode: number; data?: any }
) {
  let error: Error | null = null;
  if (err.statusCode && err.data && typeof err.data === "string") {
    try {
      const json = JSON.parse(err.data);
      if (json.error) {
        error = new Error(
          `${json.error_description}: ${json.error} ${json.error_uri}`
        );
      }
      // eslint-disable-next-line no-empty
    } catch {}
  }

  if (!error) {
    error = new Error(message);
  }

  return error;
}

interface Options {
  clientID: string;
  clientSecret: string;
  authorizationURL: string;
  tokenURL: string;
  callbackPath: string;
  scope: string;
  signingConfig: JWTSigningConfig;
  config: Config;
  authorizationParams?: Record<string, string>;
}

interface OAuth2TokensResponse {
  accessToken: string;
  params: any;
}

export interface ExchangeResponse {
  state: StateData;
  tokens: OAuth2TokensResponse;
}

export abstract class OAuth2Authenticator {
  private readonly signingConfig: JWTSigningConfig;
  private readonly clientID: string;
  private readonly authorizationURL: string;
  private readonly callbackPath: string;
  private readonly scope: string;
  private readonly authorizationParams: Record<string, string>;
  private readonly client: OAuth2;

  protected readonly secure: boolean;

  constructor({
    clientID,
    clientSecret,
    authorizationURL,
    tokenURL,
    callbackPath,
    scope,
    signingConfig,
    config,
    authorizationParams = {},
  }: Options) {
    this.clientID = clientID;
    this.authorizationURL = authorizationURL;
    this.callbackPath = callbackPath;
    this.scope = scope;
    this.signingConfig = signingConfig;
    this.secure = config.get("force_ssl");
    this.authorizationParams = authorizationParams;

    this.client = new OAuth2(
      clientID,
      clientSecret,
      "",
      authorizationURL,
      tokenURL
    );
  }

  public abstract authenticate: RequestHandler<
    TenantCoralRequest,
    Promise<void>
  >;

  protected redirect(
    req: Request<TenantCoralRequest>,
    res: Response,
    authorizationParams: Record<string, string> = {}
  ) {
    // Take the authorization url so we can use it as the base for the
    // redirection.
    const authorizeURL = new URL(this.authorizationURL);

    // Create and store state on the response.
    const state = storeState(req, res, req.secure || this.secure);

    // Add additional parameters to the search params.
    authorizeURL.searchParams.set("response_type", "code");
    authorizeURL.searchParams.set("redirect_uri", this.redirectURI(req));
    authorizeURL.searchParams.set("scope", this.scope);
    authorizeURL.searchParams.set("client_id", this.clientID);
    authorizeURL.searchParams.set("state", state);

    // Prepare the extra parameters we should add for this request.
    const params = merge({}, this.authorizationParams, authorizationParams);

    // If we have extra authorization parameters for each request, add them.
    for (const [key, value] of Object.entries(params)) {
      authorizeURL.searchParams.set(key, value);
    }

    // Redirect the user to the authorize URL.
    return res.redirect(authorizeURL.href);
  }

  private redirectURI(req: Request<TenantCoralRequest>) {
    return reconstructURL(req, this.callbackPath);
  }

  protected get(url: string, accessToken: string) {
    return new Promise<string>((resolve, reject) => {
      this.client.get(url, accessToken, (err, body) => {
        if (err) {
          return reject(err);
        }

        if (typeof body !== "string") {
          throw new Error("failed to get response from client");
        }

        return resolve(body);
      });
    });
  }

  private getOAuth2AccessToken(code: string, redirectURI: string) {
    return new Promise<OAuth2TokensResponse>((resolve, reject) => {
      this.client.getOAuthAccessToken(
        code,
        {
          grant_type: "authorization_code",
          redirect_uri: redirectURI,
        },
        (err, accessToken, refreshToken, params) => {
          if (err) {
            return reject(createOAuthError("internal oauth error", err));
          }

          return resolve({ accessToken, params });
        }
      );
    });
  }

  protected async exchange(
    req: Request<TenantCoralRequest>,
    res: Response
  ): Promise<ExchangeResponse> {
    const { code } = req.query;
    if (!code) {
      throw new Error("no code on request");
    }

    // Ensure that the passed state parameter matches the one we find in the
    // request.
    const state = verifyState(req, res, req.secure || this.secure);

    // Get the tokens from the client.
    const tokens = await this.getOAuth2AccessToken(code, this.redirectURI(req));

    return { state, tokens };
  }

  protected async success(
    state: StateData,
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

      return redirectWithHash(res, state, { accessToken });
    } catch (err) {
      return this.fail(state, err, req, res);
    }
  }

  protected fail(
    state: StateData,
    err: Error,
    req: Request<TenantCoralRequest>,
    res: Response
  ) {
    // Wrap the returned error with an authorization error.
    const error = new WrappedInternalError(
      err,
      "an authentication error occurred"
    );

    logger.error({ err }, "an authentication error occurred for a user");

    return redirectWithHash(res, state, { error: error.message });
  }
}
