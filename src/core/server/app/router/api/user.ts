import { userDownloadHandler } from "coral-server/app/handlers";

import { createAPIRouter } from "./helpers";

export function createNewUserRouter() {
  const router = createAPIRouter();

  router.get("/download", userDownloadHandler());

  return router;
}
