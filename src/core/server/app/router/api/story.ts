import { AppOptions } from "coral-server/app";
import { countHandler } from "coral-server/app/handlers";

import { createAPIRouter } from "./helpers";

export function createStoryRouter(app: AppOptions) {
  // TODO: (cvle) make caching time configurable?
  const router = createAPIRouter({ cache: "2m" });

  router.get("/count.js", countHandler(app));

  return router;
}
