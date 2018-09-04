import path from "path";

import { createFluentBundle } from "talk-framework/testHelpers";

export default function create() {
  return createFluentBundle(
    "auth",
    path.resolve(__dirname, "../../../../locales/en-US")
  );
}
