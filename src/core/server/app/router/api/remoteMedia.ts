import { AppOptions } from "coral-server/app";
import { gifSearchHandler } from "coral-server/app/handlers";

import { createAPIRouter } from "./helpers";

export function createRemoteMediaRouter(app: AppOptions) {
  const router = createAPIRouter();

  router.get("/gifs", gifSearchHandler);

  return router;
}
