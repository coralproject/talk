import express from "express";

import { AppOptions } from "coral-server/app";
import {
  confirmCheckHandler,
  confirmHandler,
  confirmRequestHandler,
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

  return router;
}
