import { Redis } from "ioredis";
import jwt from "jsonwebtoken";
import { Db } from "mongodb";
import { Strategy } from "passport-strategy";

import {
  JWTToken,
  JWTVerifier,
} from "talk-server/app/middleware/passport/strategies/verifiers/jwt";
import {
  SSOToken,
  SSOVerifier,
} from "talk-server/app/middleware/passport/strategies/verifiers/sso";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import {
  extractJWTFromRequest,
  JWTSigningConfig,
} from "talk-server/services/jwt";
import { Request } from "talk-server/types/express";

export interface JWTStrategyOptions {
  signingConfig: JWTSigningConfig;
  mongo: Db;
  redis: Redis;
}

/**
 * Token is the various forms of the Token that can be verified.
 */
type Token = SSOToken | JWTToken | object | string | null;

/**
 * Verifier allows different implementations to offer ways to verify a given
 * Token.
 */
interface Verifier<T> {
  /**
   * verify will perform the verification and return a User.
   */
  verify: (
    tokenString: string,
    token: T,
    tenant: Tenant
  ) => Promise<Readonly<User> | null>;

  /**
   * supports will perform type checking and ensure that the given Tenant
   * supports the requested verification type.
   */
  supports: (token: T | object, tenant: Tenant) => token is T;
}

export class JWTStrategy extends Strategy {
  public name = "jwt";

  private verifiers: {
    sso: Verifier<SSOToken>;
    jwt: Verifier<JWTToken>;
  };

  constructor(options: JWTStrategyOptions) {
    super();

    this.verifiers = {
      sso: new SSOVerifier(options),
      jwt: new JWTVerifier(options),
    };
  }

  private async verify(tokenString: string, tenant: Tenant) {
    const token: Token = jwt.decode(tokenString);
    if (!token || typeof token === "string") {
      // TODO: (wyattjoh) return a better error.
      throw new Error("token could not be decoded");
    }

    // TODO: add OIDC support.
    // At the moment, OpenID Connect tokens are not supported here directly,
    // instead, the default implementation redirects the user to the
    // authorization endpoint where they login, and a redirection occurs
    // yielding the token to us via the Authorization Code Flow. We then issue a
    // Talk Token for that request, that the client uses after.

    // Handle SSO integrations.
    if (this.verifiers.sso.supports(token, tenant)) {
      return this.verifiers.sso.verify(tokenString, token, tenant);
    }

    // Handle the raw JWT token.
    if (this.verifiers.jwt.supports(token, tenant)) {
      // Verify the token with the JWT verification strategy.
      return this.verifiers.jwt.verify(tokenString, token, tenant);
    }

    // No verifier could be found.
    // TODO: (wyattjoh) return a better error.
    throw new Error("no suitable jwt verifier could be found");
  }

  public async authenticate(req: Request) {
    // Get the token from the request.
    const token = extractJWTFromRequest(req);
    if (!token) {
      // There was no token on the request, so don't bother actually checking
      // anything further.
      return this.pass();
    }

    const { tenant } = req.talk!;
    if (!tenant) {
      // TODO: (wyattjoh) log this error, and return a better one?
      return this.error(new Error("tenant not found"));
    }

    try {
      const user = await this.verify(token, tenant);
      if (!user) {
        return this.pass();
      }

      return this.success(user, null);
    } catch (err) {
      // TODO: (wyattjoh) log this error
      return this.fail(err);
    }
  }
}
