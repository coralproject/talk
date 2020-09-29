import bodyParser from "body-parser";
import bytes from "bytes";

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

import { createAPIRouter } from "./helpers";

// REQUEST_MAX is the maximum request size for routes on this router.
const REQUEST_MAX = bytes("100kb");

export function createNewAccountRouter() {
  const router = createAPIRouter();

  router.post(
    "/confirm",
    jsonMiddleware(REQUEST_MAX),
    authenticate(),
    confirmRequestHandler()
  );
  router.get("/confirm", confirmCheckHandler());
  router.put("/confirm", confirmHandler());

  router.get("/invite", inviteCheckHandler());
  router.put("/invite", jsonMiddleware(REQUEST_MAX), inviteHandler());

  router.get("/notifications/unsubscribe", unsubscribeCheckHandler());
  router.delete("/notifications/unsubscribe", unsubscribeHandler());

  router.get("/download", accountDownloadCheckHandler());
  router.post(
    "/download",
    bodyParser.urlencoded({
      extended: true,
    }),
    accountDownloadHandler()
  );

  return router;
}
