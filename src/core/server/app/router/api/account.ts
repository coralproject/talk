import bodyParser from "body-parser";
import express from "express";

import { AppOptions } from "coral-server/app";
import {
  confirmCheckHandler,
  confirmHandler,
  confirmRequestHandler,
  downloadCheckHandler,
  downloadHandler,
  inviteCheckHandler,
  inviteHandler,
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

  router.get("/downloadcheck", downloadCheckHandler(app));
  router.post(
    "/download",
    bodyParser.urlencoded({
      extended: true,
    }),
    downloadHandler(app)
  );

  return router;
}
