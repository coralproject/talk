import express from "express";

import { AppOptions } from "coral-server/app";
import { accountDownloadHandler } from "coral-server/app/handlers";

export function createNewUserRouter(app: AppOptions) {
  const router = express.Router();

  router.get("/download", accountDownloadHandler(app));

  return router;
}
