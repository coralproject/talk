import { parseQuery } from "coral-common/utils";
import { globalErrorReporter } from "coral-framework/lib/errors/reporter";

export default function getParamsFromHash(window: Window) {
  try {
    return window.location.hash
      ? parseQuery(window.location.hash.substr(1))
      : null;
  } catch (err) {
    globalErrorReporter.report(err);
    return null;
  }
}
