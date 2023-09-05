import { globalErrorReporter } from "coral-framework/lib/errors/reporter";

import clearHash from "./clearHash";
import getParamsFromHash from "./getParamsFromHash";

export default function getParamsFromHashAndClearIt(window: Window) {
  try {
    const params = getParamsFromHash(window) || {};

    // Clear the hash contents.
    clearHash(window);

    return params;
  } catch (err) {
    globalErrorReporter.report(err);
    return {};
  }
}
