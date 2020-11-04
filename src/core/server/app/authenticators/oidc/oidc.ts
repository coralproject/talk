import { Response } from "express";
import { Redis } from "ioredis";
import jwks, { JwksClient } from "jwks-rsa";
import { Db } from "mongodb";

import { OIDCAuthIntegration } from "coral-server/models/settings";
import { JWTSigningConfig } from "coral-server/services/jwt";
import {
  findOrCreateOIDCUser,
  verifyIDToken,
} from "coral-server/services/oidc";
import {
  Request,
  RequestHandler,
  TenantCoralRequest,
} from "coral-server/types/express";

import { OAuth2Authenticator } from "../oauth2";
import { storeNonce, verifyNonce } from "./nonce";

interface Options {
  mongo: Db;
  redis: Redis;
  signingConfig: JWTSigningConfig;
  integration: Required<OIDCAuthIntegration>;
  callbackPath: string;
}

export class OIDCAuthenticator extends OAuth2Authenticator {
  private readonly jwks: JwksClient;
  private readonly integration: Readonly<Required<OIDCAuthIntegration>>;
  private readonly mongo: Db;
  private readonly redis: Redis;

  constructor({ integration, mongo, redis, ...options }: Options) {
    super({
      ...options,
      ...integration,
      scope: "openid email profile",
    });

    this.jwks = jwks({ jwksUri: integration.jwksURI });
    this.integration = integration;
    this.mongo = mongo;
    this.redis = redis;
  }

  private async verifyToken(
    req: Request<TenantCoralRequest>,
    res: Response,
    idToken: string
  ) {
    const { now, tenant } = req.coral;

    // Verify the ID Token.
    const token = await verifyIDToken(
      idToken,
      this.jwks,
      this.integration.issuer,
      now
    );

    // Verify that the nonce is correct.
    verifyNonce(req, res, token.nonce);

    // Get the time.
    const lastSeen = Math.round(now.getTime() / 1000);

    // Expire the nonce record in Redis after the ID token would no longer be
    // considered valid (bypassing the need for the replay attack check).
    const expiresIn = token.exp - lastSeen;

    // Verify that we've only seen this nonce once.
    const result = await this.redis.set(
      `oidc:${tenant.id}:nonce:${token.nonce}`,
      lastSeen,
      "EX",
      expiresIn,
      "NX"
    );
    if (!result) {
      throw new Error("nonce already used");
    }

    return token;
  }

  public authenticate: RequestHandler<
    TenantCoralRequest,
    Promise<void>
  > = async (req, res) => {
    try {
      const { tenant, now } = req.coral;

      // If we don't have a code on the request, then we should redirect the user.
      if (!req.query.code) {
        // We're starting the authentication flow! Create the nonce.
        const nonce = storeNonce(req, res);

        // Redirect the user (Adding the nonce value to the authorization
        // params).
        return this.redirect(req, res, { nonce });
      }

      // Exchange the code for tokens.
      const {
        params: { id_token: idToken },
      } = await this.exchange(req, res);

      // Try to get the id_token out of the params.
      if (!idToken || typeof idToken !== "string") {
        throw new Error("no id_token provided");
      }

      // Verify the id_token.
      const token = await this.verifyToken(req, res, idToken);

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
