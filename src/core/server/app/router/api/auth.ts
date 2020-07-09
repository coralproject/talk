import bytes from "bytes";
import express from "express";

import { AppOptions } from "coral-server/app";
import {
  forgotCheckHandler,
  forgotHandler,
  forgotResetHandler,
  linkHandler,
  logoutHandler,
  signupHandler,
} from "coral-server/app/handlers";
import { noCacheMiddleware } from "coral-server/app/middleware/cacheHeaders";
import { jsonMiddleware } from "coral-server/app/middleware/json";
import { loggedInMiddleware } from "coral-server/app/middleware/loggedIn";
import {
  authenticate,
  wrapAuthn,
  wrapOAuth2Authn,
} from "coral-server/app/middleware/passport";
import { RouterOptions } from "coral-server/app/router/types";

import { createAPIRouter } from "./helpers";

// REQUEST_MAX is the maximum request size for routes on this router.
const REQUEST_MAX = bytes("100kb");

function wrapPath(
  app: AppOptions,
  { passport }: Pick<RouterOptions, "passport">,
  router: express.Router,
  strategy: string,
  path = `/${strategy}`
) {
  const handler = wrapOAuth2Authn(passport, app.signingConfig, strategy);

  router.get(path, noCacheMiddleware, handler);
  router.get(path + "/callback", noCacheMiddleware, handler);
}

export function createNewAuthRouter(
  app: AppOptions,
  { passport }: Pick<RouterOptions, "passport">
) {
  const router = createAPIRouter();

  // Mount the Local Authentication handlers.
  router.post(
    "/local",
    jsonMiddleware(REQUEST_MAX),
    wrapAuthn(passport, app.signingConfig, "local")
  );

  router.post("/local/signup", jsonMiddleware(REQUEST_MAX), signupHandler(app));
  router.get("/local/forgot", forgotCheckHandler(app));
  router.put(
    "/local/forgot",
    jsonMiddleware(REQUEST_MAX),
    forgotResetHandler(app)
  );
  router.post("/local/forgot", jsonMiddleware(REQUEST_MAX), forgotHandler(app));

  // Mount the link handler.
  router.post(
    "/link",
    authenticate(passport),
    loggedInMiddleware,
    jsonMiddleware(REQUEST_MAX),
    linkHandler(app)
  );

  // Mount the logout handler.
  router.delete("/", authenticate(passport), logoutHandler(app));

  // Mount the external auth integrations with middleware/handle wrappers.
  wrapPath(app, { passport }, router, "facebook");
  wrapPath(app, { passport }, router, "google");
  wrapPath(app, { passport }, router, "oidc");

  return router;
}
