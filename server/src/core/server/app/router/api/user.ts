import { AppOptions } from "coral-server/app";
import { userDownloadHandler } from "coral-server/app/handlers";

import { createAPIRouter } from "./helpers";

export function createNewUserRouter(app: AppOptions) {
  const router = createAPIRouter();

  router.get("/download", userDownloadHandler(app));

  return router;
}
