import { FluentBundle } from "@fluent/bundle/compat";

import { globalErrorReporter } from "../errors";

export default function format(
  bundles: FluentBundle[],
  key: string,
  args?: object
): string {
  const res = bundles.reduce((val, bundle) => {
    const message = bundle.getMessage(key);
    if (!message || !message.value) {
      return val;
    }

    const errors: Error[] = [];
    const formatted = bundle.formatPattern(message.value, args, errors);
    if (errors.length > 0) {
      globalErrorReporter.report(
        `Translation ${key} encountered an error: ${errors
          .map((err) => err.message)
          .join(", ")}`
      );
    }

    return formatted;
  }, "");
  if (res && Array.isArray(res)) {
    return res.join("");
  }

  return res || "";
}
