import { AppOptions } from "coral-server/app";
import express from "express";

import { downloadHandler } from "coral-server/app/handlers";

export function createDownloadRouter(app: AppOptions) {
  const router = express.Router();

  router.get("/", downloadHandler(app));

  return router;
}
