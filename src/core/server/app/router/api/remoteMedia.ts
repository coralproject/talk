import { AppOptions } from "coral-server/app";
import { gifSearchHandler } from "coral-server/app/handlers";

import { createAPIRouter } from "./helpers";

export function createRemoteMediaRouter(app: AppOptions) {
  // All responses from the GIF search are cached for 30 seconds on the CDN.
  const router = createAPIRouter({ cacheDuration: "30s" });

  router.get("/gifs", gifSearchHandler);

  return router;
}
