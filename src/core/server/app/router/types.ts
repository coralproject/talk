import passport from "passport";

export interface RouterOptions {
  /**
   * passport is the instance of the Authenticator that can be used to create
   * and mount new authentication middleware.
   */
  passport: passport.Authenticator;

  /**
   * disableClientRoutes will not mount the routes to the client bundles.
   */
  disableClientRoutes: boolean;
}
