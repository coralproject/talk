import bytes from "bytes";
import express from "express";

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

import { createAPIRouter } from "./helpers";

// REQUEST_MAX is the maximum request size for routes on this router.
const REQUEST_MAX = bytes("100kb");

function wrapPath(
  router: express.Router,
  strategy: string,
  path = `/${strategy}`
) {
  const handler = wrapOAuth2Authn(strategy);

  router.get(path, noCacheMiddleware, handler);
  router.get(path + "/callback", noCacheMiddleware, handler);
}

export function createNewAuthRouter() {
  const router = createAPIRouter();

  // Mount the Local Authentication handlers.
  router.post("/local", jsonMiddleware(REQUEST_MAX), wrapAuthn("local"));

  router.post("/local/signup", jsonMiddleware(REQUEST_MAX), signupHandler());
  router.get("/local/forgot", forgotCheckHandler());
  router.put(
    "/local/forgot",
    jsonMiddleware(REQUEST_MAX),
    forgotResetHandler()
  );
  router.post("/local/forgot", jsonMiddleware(REQUEST_MAX), forgotHandler());

  // Mount the link handler.
  router.post(
    "/link",
    authenticate(),
    loggedInMiddleware,
    jsonMiddleware(REQUEST_MAX),
    linkHandler()
  );

  // Mount the logout handler.
  router.delete("/", authenticate(), logoutHandler());

  // Mount the external auth integrations with middleware/handle wrappers.
  wrapPath(router, "facebook");
  wrapPath(router, "google");
  wrapPath(router, "oidc");

  return router;
}
