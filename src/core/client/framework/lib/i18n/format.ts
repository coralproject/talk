import { FluentBundle } from "@fluent/bundle/compat";

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
    if (process.env.NODE_ENV !== "production" && errors.length > 0) {
      window.console.warn(
        `Translation ${key} encountered an error: ${errors
          .map(err => err.message)
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
