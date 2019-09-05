import bodyParser from "body-parser";
import express from "express";

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

export function createNewAccountRouter(
  app: AppOptions,
  { passport }: Pick<RouterOptions, "passport">
) {
  const router = express.Router();

  router.post(
    "/confirm",
    jsonMiddleware,
    authenticate(passport),
    confirmRequestHandler(app)
  );
  router.get("/confirm", confirmCheckHandler(app));
  router.put("/confirm", confirmHandler(app));

  router.get("/invite", inviteCheckHandler(app));
  router.put("/invite", jsonMiddleware, inviteHandler(app));

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
