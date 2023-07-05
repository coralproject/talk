import bytes from "bytes";

import { AppOptions } from "coral-server/app";
import {
  facebookHandler,
  forgotCheckHandler,
  forgotHandler,
  forgotResetHandler,
  googleHandler,
  linkHandler,
  logoutHandler,
  oidcHandler,
  signupHandler,
} from "coral-server/app/handlers";
import { jsonMiddleware } from "coral-server/app/middleware/json";
import { loggedInMiddleware } from "coral-server/app/middleware/loggedIn";
import { authenticate, wrapAuthn } from "coral-server/app/middleware/passport";
import { RouterOptions } from "coral-server/app/router/types";

import { createAPIRouter } from "./helpers";

// REQUEST_MAX is the maximum request size for routes on this router.
const REQUEST_MAX = bytes("100kb");

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
  const facebook = facebookHandler(app);

  router.get("/facebook", facebook);
  router.get("/facebook/callback", facebook);

  const google = googleHandler(app);

  router.get("/google", google);
  router.get("/google/callback", google);

  const oidc = oidcHandler(app);

  router.get("/oidc", oidc);
  router.get("/oidc/callback", oidc);

  return router;
}
