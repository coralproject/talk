import jwt from "jsonwebtoken";
import { Strategy } from "passport-strategy";

import { AppOptions } from "talk-server/app";
import { TenantNotFoundError, TokenInvalidError } from "talk-server/errors";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import { extractJWTFromRequest } from "talk-server/services/jwt";
import { Request } from "talk-server/types/express";

import { JWTToken, JWTVerifier } from "./verifiers/jwt";
import { OIDCIDToken, OIDCVerifier } from "./verifiers/oidc";
import { SSOToken, SSOVerifier } from "./verifiers/sso";

export type JWTStrategyOptions = Pick<
  AppOptions,
  "signingConfig" | "mongo" | "redis" | "tenantCache"
>;

/**
 * Token is the various forms of the Token that can be verified.
 */
type Token = OIDCIDToken | SSOToken | JWTToken | object | string | null;

/**
 * Verifier allows different implementations to offer ways to verify a given
 * Token.
 */
export interface Verifier<T = Token> {
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

  private verifiers: Verifier[];

  constructor(options: JWTStrategyOptions) {
    super();

    this.verifiers = [
      new OIDCVerifier(options),
      new SSOVerifier(options),
      new JWTVerifier(options),
    ];
  }

  private async verify(tokenString: string, tenant: Tenant) {
    const token: Token = jwt.decode(tokenString);
    if (!token || typeof token === "string") {
      throw new TokenInvalidError(tokenString, "token could not be decoded");
    }

    // Try to verify the token.
    for (const verifier of this.verifiers) {
      if (verifier.supports(token, tenant)) {
        return verifier.verify(tokenString, token, tenant);
      }
    }

    // No verifier could be found.
    throw new TokenInvalidError(
      tokenString,
      "no suitable jwt verifier could be found"
    );
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
      return this.error(new TenantNotFoundError(req.hostname));
    }

    try {
      const user = await this.verify(token, tenant);
      if (!user) {
        return this.pass();
      }

      return this.success(user, null);
    } catch (err) {
      return this.error(err);
    }
  }
}
