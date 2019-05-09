import express from "express";

import { AppOptions } from "talk-server/app";
import {
  confirmCheckHandler,
  confirmHandler,
  confirmRequestHandler,
} from "talk-server/app/handlers";
import { jsonMiddleware } from "talk-server/app/middleware/json";
import { authenticate } from "talk-server/app/middleware/passport";
import { RouterOptions } from "talk-server/app/router/types";

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

  return router;
}
