import express from "express";

import { AppOptions } from "talk-server/app";
import managementGraphMiddleware from "talk-server/graph/management/middleware";

export async function createManagementRouter(app: AppOptions) {
  const router = express.Router();

  // Management API
  router.use(
    "/graphql",
    express.json(),
    await managementGraphMiddleware(
      app.schemas.management,
      app.config,
      app.mongo
    )
  );

  return router;
}
