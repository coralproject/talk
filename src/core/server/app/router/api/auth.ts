import express from "express";

import { AppOptions } from "talk-server/app";
import {
  logoutHandler,
  signupHandler,
} from "talk-server/app/handlers/api/tenant/auth/local";
import {
  wrapAuthn,
  wrapOAuth2Authn,
} from "talk-server/app/middleware/passport";
import { RouterOptions } from "talk-server/app/router/types";

function wrapPath(
  app: AppOptions,
  options: RouterOptions,
  router: express.Router,
  strategy: string,
  path: string = `/${strategy}`
) {
  const handler = wrapOAuth2Authn(
    options.passport,
    app.signingConfig,
    strategy
  );

  router.get(path, handler);
  router.get(path + "/callback", handler);
}

export function createNewAuthRouter(app: AppOptions, options: RouterOptions) {
  const router = express.Router();

  // Mount the logout handler.
  router.delete(
    "/",
    options.passport.authenticate("jwt", { session: false }),
    logoutHandler({ redis: app.redis })
  );

  // Mount the Local Authentication handlers.
  router.post(
    "/local",
    express.json(),
    wrapAuthn(options.passport, app.signingConfig, "local")
  );
  router.post(
    "/local/signup",
    express.json(),
    signupHandler({ db: app.mongo, signingConfig: app.signingConfig })
  );

  // Mount the external auth integrations with middleware/handle wrappers.
  wrapPath(app, options, router, "facebook");
  wrapPath(app, options, router, "google");
  wrapPath(app, options, router, "oidc", "/oidc/:oidc");

  return router;
}
