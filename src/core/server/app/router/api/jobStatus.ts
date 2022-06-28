import { Router } from "express";

import { AppOptions } from "coral-server/app";
import { jobStatusHandler } from "coral-server/app/handlers/api/jobStatus";

import { createAPIRouter } from "./helpers";

export function createJobStatusRouter(app: AppOptions): Router {
  const router = createAPIRouter();

  // Configure job status route.
  router.post("/", jobStatusHandler(app));

  return router;
}
