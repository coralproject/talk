import jwks, { JwksClient } from "jwks-rsa";
import { Db } from "mongodb";

import { OIDCAuthIntegration } from "coral-server/models/settings";
import { JWTSigningConfig } from "coral-server/services/jwt";
import {
  findOrCreateOIDCUser,
  verifyIDToken,
} from "coral-server/services/oidc";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

import { OAuth2Authenticator } from "./oauth2";

interface Options {
  mongo: Db;
  signingConfig: JWTSigningConfig;
  integration: Required<OIDCAuthIntegration>;
  callbackPath: string;
}

export class OIDCAuthenticator extends OAuth2Authenticator {
  private readonly mongo: Db;
  private readonly jwks: JwksClient;
  private readonly integration: Readonly<Required<OIDCAuthIntegration>>;

  constructor({ integration, mongo, ...options }: Options) {
    super({
      ...options,
      ...integration,
      scope: "openid email profile",
    });

    this.jwks = jwks({ jwksUri: integration.jwksURI });
    this.integration = integration;
    this.mongo = mongo;
  }

  public authenticate: RequestHandler<TenantCoralRequest> = async (
    req,
    res
  ) => {
    try {
      const { tenant, now } = req.coral;

      // If we don't have a code on the request, then we should redirect the user.
      if (!req.query.code) {
        return this.redirect(req, res);
      }

      // Exchange the code for tokens.
      const {
        params: { id_token },
      } = await this.exchange(req, res);

      // Try to get the id_token out of the params.
      if (!id_token || typeof id_token !== "string") {
        throw new Error("no id_token provided");
      }

      // Verify the ID Token.
      const token = await verifyIDToken(
        id_token,
        this.jwks,
        this.integration.issuer,
        req.coral.now
      );

      // Find or create the user.
      const user = await findOrCreateOIDCUser(
        this.mongo,
        tenant,
        this.integration,
        token,
        now
      );

      return this.success(user, req, res);
    } catch (err) {
      return this.fail(err, req, res);
    }
  };
}
