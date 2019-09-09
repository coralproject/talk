import express from "express";

import { AppOptions } from "coral-server/app";
import {
  userDeleteHandler,
  userDownloadHandler,
  userUpdateUsernameHandler,
} from "coral-server/app/handlers";
import { userUpdateEmailHandler } from "coral-server/app/handlers";
import { jsonMiddleware } from "coral-server/app/middleware/json";
import { authenticate } from "coral-server/app/middleware/passport";
import { RouterOptions } from "coral-server/app/router/types";

export function createNewUserRouter(
  app: AppOptions,
  { passport }: Pick<RouterOptions, "passport">
) {
  const router = express.Router();

  router.get("/download", userDownloadHandler(app));

  router.post(
    "/updateEmail",
    jsonMiddleware,
    authenticate(passport),
    userUpdateEmailHandler(app)
  );
  router.post(
    "/updateUsername",
    jsonMiddleware,
    authenticate(passport),
    userUpdateUsernameHandler(app)
  );
  router.post(
    "/delete",
    jsonMiddleware,
    authenticate(passport),
    userDeleteHandler(app)
  );

  return router;
}
