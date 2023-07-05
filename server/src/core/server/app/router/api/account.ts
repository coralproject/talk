import bodyParser from "body-parser";
import bytes from "bytes";

import { AppOptions } from "coral-server/app";
import {
  accountDownloadCheckHandler,
  accountDownloadHandler,
  confirmCheckHandler,
  confirmHandler,
  confirmRequestHandler,
  inviteCheckHandler,
  inviteHandler,
  unsubscribeCheckHandler,
  unsubscribeHandler,
} from "coral-server/app/handlers";
import { jsonMiddleware } from "coral-server/app/middleware/json";
import { authenticate } from "coral-server/app/middleware/passport";
import { RouterOptions } from "coral-server/app/router/types";

import { createAPIRouter } from "./helpers";

// REQUEST_MAX is the maximum request size for routes on this router.
const REQUEST_MAX = bytes("100kb");

export function createNewAccountRouter(
  app: AppOptions,
  { passport }: Pick<RouterOptions, "passport">
) {
  const router = createAPIRouter();

  router.post(
    "/confirm",
    jsonMiddleware(REQUEST_MAX),
    authenticate(passport),
    confirmRequestHandler(app)
  );
  router.get("/confirm", confirmCheckHandler(app));
  router.put("/confirm", confirmHandler(app));

  router.get("/invite", inviteCheckHandler(app));
  router.put("/invite", jsonMiddleware(REQUEST_MAX), inviteHandler(app));

  router.get("/notifications/unsubscribe", unsubscribeCheckHandler(app));
  router.delete("/notifications/unsubscribe", unsubscribeHandler(app));

  router.get("/download", accountDownloadCheckHandler(app));
  router.post(
    "/download",
    bodyParser.urlencoded({
      extended: true,
    }),
    accountDownloadHandler(app)
  );

  return router;
}
