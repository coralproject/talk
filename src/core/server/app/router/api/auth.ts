import express from "express";

import { AppOptions } from "talk-server/app";
import {
  logoutHandler,
  signupHandler,
} from "talk-server/app/handlers/api/tenant/auth/local";
import { wrapAuthn } from "talk-server/app/middleware/passport";
import { RouterOptions } from "talk-server/app/router/types";

export function createNewAuthRouter(app: AppOptions, options: RouterOptions) {
  const router = express.Router();

  // Mount the passport routes.
  router.delete(
    "/",
    options.passport.authenticate("jwt", { session: false }),
    logoutHandler({ redis: app.redis })
  );

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

  router.get(
    "/oidc/:oidcID",
    wrapAuthn(options.passport, app.signingConfig, "oidc")
  );
  router.get(
    "/oidc/:oidcID/callback",
    wrapAuthn(options.passport, app.signingConfig, "oidc")
  );

  return router;
}
