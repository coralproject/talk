import { Response } from "express";
import { OAuth2 } from "oauth";

import { stringifyQuery } from "coral-common/utils";
import { reconstructURL } from "coral-server/app/url";
import { User } from "coral-server/models/user";
import { JWTSigningConfig, signTokenString } from "coral-server/services/jwt";
import {
  Request,
  RequestHandler,
  TenantCoralRequest,
} from "coral-server/types/express";

import { createAndStoreState, getAndClearState } from "./state";

export function redirectWithHash(res: Response, hash: Record<string, any>) {
  res.redirect(`/embed/auth/callback${stringifyQuery(hash, "#")}`);
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
  authorizationParams?: Record<string, string>;
}

interface OAuth2Response {
  accessToken: string;
  params: any;
}

export abstract class OAuth2Authenticator {
  private readonly signingConfig: JWTSigningConfig;
  private readonly clientID: string;
  private readonly authorizationURL: string;
  private readonly callbackPath: string;
  private readonly scope: string;
  private readonly authorizationParams?: Record<string, string>;

  protected readonly client: OAuth2;

  constructor({
    clientID,
    clientSecret,
    authorizationURL,
    tokenURL,
    callbackPath,
    scope,
    signingConfig,
    authorizationParams,
  }: Options) {
    this.clientID = clientID;
    this.authorizationURL = authorizationURL;
    this.callbackPath = callbackPath;
    this.scope = scope;
    this.signingConfig = signingConfig;
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

  protected redirect(req: Request<TenantCoralRequest>, res: Response) {
    // Take the authorization url so we can use it as the base for the
    // redirection.
    const authorizeURL = new URL(this.authorizationURL);

    // Create and store state on the response.
    const state = createAndStoreState(res);

    // Add additional parameters to the search params.
    authorizeURL.searchParams.set("response_type", "code");
    authorizeURL.searchParams.set("redirect_uri", this.redirectURI(req));
    authorizeURL.searchParams.set("scope", this.scope);
    authorizeURL.searchParams.set("client_id", this.clientID);
    authorizeURL.searchParams.set("state", state);

    // If we have extra authorization parameters, add them.
    if (this.authorizationParams) {
      for (const [key, value] of Object.entries(this.authorizationParams)) {
        authorizeURL.searchParams.set(key, value);
      }
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
    return new Promise<OAuth2Response>((resolve, reject) => {
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

  protected exchange(req: Request<TenantCoralRequest>, res: Response) {
    const { code } = req.query;
    if (!code) {
      throw new Error("no code on request");
    }

    // Ensure that the passed state parameter matches the one we find in the
    // request.
    const providedState = req.query.state;
    if (typeof providedState !== "string" || providedState.length === 0) {
      throw new Error("bad state parameter");
    }

    const state = getAndClearState(req, res);
    if (!state) {
      throw new Error("bad state parameter");
    }

    if (providedState !== state) {
      throw new Error("bad state parameter");
    }

    return this.getOAuth2AccessToken(code, this.redirectURI(req));
  }

  protected async success(
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

      return redirectWithHash(res, { accessToken });
    } catch (err) {
      return this.fail(err, req, res);
    }
  }

  protected fail(err: Error, req: Request<TenantCoralRequest>, res: Response) {
    return redirectWithHash(res, { error: err.message });
  }
}
