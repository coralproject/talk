import path from "path";

import { createFluentBundle } from "talk-framework/testHelpers";

export default function create() {
  return createFluentBundle(
    "admin",
    path.resolve(__dirname, "../../../../locales/en-US")
  );
}
