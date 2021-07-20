import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Strategy } from "passport-strategy";

import { AppOptions } from "coral-server/app";
import {
  JWTRevokedError,
  TenantNotFoundError,
  TokenInvalidError,
} from "coral-server/errors";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import {
  extractTokenFromRequest,
  StandardHeader,
} from "coral-server/services/jwt";
import { OIDCIDToken } from "coral-server/services/oidc";
import { Request, TenantCoralRequest } from "coral-server/types/express";

import { JWTToken, JWTVerifier } from "./verifiers/jwt";
import { OIDCVerifier } from "./verifiers/oidc";
import { SSOToken, SSOVerifier } from "./verifiers/sso";

export type JWTStrategyOptions = Pick<
  AppOptions,
  "signingConfig" | "mongo" | "redis" | "tenantCache" | "mongo"
>;

/**
 * Token is the various forms of the Token that can be verified.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export type Token = OIDCIDToken | SSOToken | JWTToken | object | string | null;

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
    tenant: Tenant,
    now: Date,
    kid?: string
  ) => Promise<Readonly<User> | null>;

  /**
   * supports will perform type checking and ensure that the given Tenant
   * supports the requested verification type.
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  supports: (token: T | object, tenant: Tenant, kid?: string) => token is T;
}

export function createVerifiers(
  options: JWTStrategyOptions
): Array<Verifier<Token>> {
  return [
    new OIDCVerifier(options),
    new SSOVerifier(options),
    new JWTVerifier(options),
  ];
}

export async function verifyAndRetrieveUser(
  verifiers: Array<Verifier<Token>>,
  tenant: Tenant,
  tokenString: string,
  now = new Date()
) {
  // Decode the token into header and payload parts.
  const decoded = jwt.decode(tokenString, {
    complete: true,
  });
  if (!decoded || typeof decoded === "string") {
    throw new TokenInvalidError(tokenString, "token could not be decoded");
  }

  // Pull the parts of the token apart.
  const header: StandardHeader = decoded.header;
  const token: Token = decoded.payload;

  try {
    // Try to verify the token.
    for (const verifier of verifiers) {
      if (verifier.supports(token, tenant)) {
        return await verifier.verify(
          tokenString,
          token,
          tenant,
          now,
          header.kid
        );
      }
    }
  } catch (err) {
    // When the JWT was revoked, just indicate that there is no user on the
    // request rather than erroring out.
    if (
      err instanceof JWTRevokedError ||
      err.cause() instanceof TokenExpiredError
    ) {
      return null;
    }

    throw err;
  }

  // No verifier could be found.
  throw new TokenInvalidError(
    tokenString,
    "no suitable jwt verifier could be found"
  );
}

export class JWTStrategy extends Strategy {
  public name = "jwt";

  private verifiers: Verifier[];

  constructor(options: JWTStrategyOptions) {
    super();

    this.verifiers = createVerifiers(options);
  }

  public async authenticate(req: Request<TenantCoralRequest>) {
    // Get the token from the request.
    const token = extractTokenFromRequest(req);
    if (!token) {
      // There was no token on the request, so don't bother actually checking
      // anything further.
      return this.pass();
    }

    const { now, tenant } = req.coral;
    if (!tenant) {
      return this.error(new TenantNotFoundError(req.hostname));
    }

    try {
      const user = await verifyAndRetrieveUser(
        this.verifiers,
        tenant,
        token,
        now
      );
      if (!user) {
        return this.pass();
      }

      return this.success(user, null);
    } catch (err) {
      return this.error(err);
    }
  }
}
