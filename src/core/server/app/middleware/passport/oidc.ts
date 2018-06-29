import jwt from "jsonwebtoken";
import jwks, { JwksClient } from "jwks-rsa";
import { Strategy as OAuth2Strategy } from "passport-oauth2";
import { Strategy } from "passport-strategy";

import { reconstructURL } from "talk-server/app/url";
import { OIDCAuthIntegration, Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import { Request } from "talk-server/types/express";

export type OIDCStrategyOptions = any;

export interface Params {
  id_token?: string;
}

export type VerifyCallback = (
  err?: Error | null,
  user?: User | null,
  info?: object
) => void;

export interface Token {
  iss: string;
  sub: string;
  email: string;
  email_verified?: boolean;
}

export type OIDCStrategyCallback = (
  tenant: Tenant,
  token: Token,
  done: VerifyCallback
) => void;

export interface StrategyItem {
  strategy: OAuth2Strategy;
  jwksClient?: JwksClient;
}

// FIXME: attach strategy to cache updates of the tenants

export default class OIDCStrategy extends Strategy {
  public name: string;

  private verify: OIDCStrategyCallback;
  private cache: Map<string, StrategyItem>;

  constructor(options: OIDCStrategyOptions, verify: OIDCStrategyCallback) {
    super();

    this.name = "oidc";
    this.cache = new Map();
    this.verify = verify;
  }

  private lookupJWKSClient(
    req: Request,
    tenantID: string,
    oidc: OIDCAuthIntegration
  ) {
    let entry = this.cache.get(tenantID);
    if (!entry) {
      const strategy = this.createStrategy(req, oidc);

      // Create the entry.
      entry = {
        strategy,
      };

      // We don't reset the entry in the cache here because if we just created
      // it, we'll be creating the jwksClient anyways, so we'll update it there.
    }

    if (!entry.jwksClient) {
      // Create the new JWKS client.
      const jwksClient = jwks({
        jwksUri: oidc.jwksURI,
      });

      // Set the jwksClient on the entry.
      entry.jwksClient = jwksClient;

      // Update the cached entry.
      this.cache.set(tenantID, entry);
    }

    return entry.jwksClient;
  }

  private verifyCallback(
    req: Request,
    accessToken: string,
    refreshToken: string,
    params: Params,
    profile: any,
    done: VerifyCallback
  ) {
    // Try to lookup user given their id provided in the `sub` claim of the
    // `id_token`.
    const { id_token } = params;
    if (!id_token) {
      // TODO: return better error.
      return done(new Error("no id_token in params"));
    }

    // Grab the tenant out of the request, as we need some more details.
    const { tenant } = req;

    // Grab the JWKSClient.
    const client = this.lookupJWKSClient(req, tenant!.id, tenant!.auth.oidc!);

    // Verify that the id_token is valid or not.
    jwt.verify(
      id_token,
      ({ kid }, callback) => {
        if (!kid) {
          // TODO: return better error.
          return callback(new Error("no kid in id_token"));
        }

        // Get the signing key from the jwks provider.
        client.getSigningKey(kid, (err, key) => {
          if (err) {
            // TODO: wrap error?
            return callback(err);
          }

          const signingKey = key.publicKey || key.rsaPublicKey;
          callback(null, signingKey);
        });
      },
      {
        issuer: tenant!.auth.oidc!.issuer,
      },
      (err, decoded) => {
        if (err) {
          // TODO: wrap error?
          return done(err);
        }

        this.verify(tenant!, decoded as Token, done);
      }
    );
  }

  private createStrategy(
    req: Request,
    integration: OIDCAuthIntegration
  ): OAuth2Strategy {
    const { clientID, clientSecret, authorizationURL, tokenURL } = integration;

    // Construct the callbackURL from the request.
    const callbackURL = reconstructURL(req, "/api/tenant/auth/oidc/callback");

    // Create a new OAuth2Strategy, where we pass the verify callback bound to
    // this OIDCStrategy instance.
    return new OAuth2Strategy(
      {
        passReqToCallback: true,
        clientID,
        clientSecret,
        authorizationURL,
        tokenURL,
        callbackURL,
      },
      this.verifyCallback.bind(this)
    );
  }

  private async lookupStrategy(req: Request) {
    const { tenant } = req;
    if (!tenant) {
      // TODO: return a better error.
      throw new Error("tenant not found");
    }

    // Get the integration from the tenant. If needed, it will be used to create
    // a new strategy.
    const integration = tenant.auth.oidc;
    if (!integration) {
      // TODO: return a better error.
      throw new Error("integration not found");
    }

    // Try to get the Tenant's cached integrations.
    let entry = this.cache.get(tenant.id);
    if (!entry) {
      // Create the strategy.
      const strategy = this.createStrategy(req, integration);

      // Reset the entry.
      entry = {
        strategy,
      };

      // Update the cached integrations value.
      this.cache.set(tenant.id, entry);
    }

    return entry.strategy;
  }

  public async authenticate(req: Request) {
    // Lookup the strategy.
    const strategy = await this.lookupStrategy(req);
    if (!strategy) {
      return;
    }

    // Augment the strategy with the request method bindings.
    strategy.error = this.error.bind(this);
    strategy.fail = this.fail.bind(this);
    strategy.pass = this.pass.bind(this);
    strategy.redirect = this.redirect.bind(this);
    strategy.success = this.success.bind(this);

    // Authenticate with the strategy, binding the current context to the method
    // to provide it with the augmented passport handlers. We also request the
    // 'openid' scope so we can get an id_token back.
    strategy.authenticate(req, { scope: "openid email", session: false });
  }
}
