import passport from "passport";
import { Strategy } from "passport-oauth2";
import { injectAll, registry, singleton } from "tsyringe";

import FacebookStrategy from "./strategies/facebook";
import GoogleStrategy from "./strategies/google";
import JWTStrategy from "./strategies/jwt";
import LocalStrategy from "./strategies/local";
import OIDCStrategy from "./strategies/oidc";

export const STRATEGIES = Symbol("STRATEGIES");

@singleton()
@registry([
  { token: STRATEGIES, useClass: LocalStrategy },
  { token: STRATEGIES, useClass: OIDCStrategy },
  { token: STRATEGIES, useClass: JWTStrategy },
  { token: STRATEGIES, useClass: FacebookStrategy },
  { token: STRATEGIES, useClass: GoogleStrategy },
])
export class AuthenticatorService extends passport.Authenticator {
  constructor(@injectAll(STRATEGIES) strategies: Strategy[]) {
    super();

    for (const strategy of strategies) {
      this.use(strategy);
    }
  }
}
