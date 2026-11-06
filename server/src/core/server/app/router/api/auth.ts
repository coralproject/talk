import bytes from "bytes";

import { AppOptions } from "coral-server/app";
import {
  atprotoHandlers,
  facebookHandler,
  forgotCheckHandler,
  forgotHandler,
  forgotResetHandler,
  googleHandler,
  linkHandler,
  logoutHandler,
  oidcHandler,
  retrieveAuthHandoffHandler,
  signupHandler,
  storeAuthHandoffHandler,
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

  // The atproto handlers are shared with the logout handler, which ends the
  // user's atproto session when they sign out.
  const atproto = atprotoHandlers(app);

  // Mount the logout handler.
  router.delete(
    "/",
    authenticate(passport),
    logoutHandler({ ...app, revokeAtproto: atproto.revoke })
  );

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

  // The atproto login takes the handle from the sign in form and replies with
  // the authorization URL, instead of redirecting like the integrations above.
  router.post("/atproto", jsonMiddleware(REQUEST_MAX), atproto.login);
  router.get("/atproto/clientmetadata.json", atproto.metadata);
  router.get("/atproto/callback", atproto.callback);

  // Passes a token from the sign in popup to the page that opened it, when the
  // popup can't reach it with window.opener.
  router.post(
    "/handoff",
    authenticate(passport),
    loggedInMiddleware,
    jsonMiddleware(REQUEST_MAX),
    storeAuthHandoffHandler(app)
  );
  router.get("/handoff/:id", retrieveAuthHandoffHandler(app));

  return router;
}
