import { FluentBundle } from "@fluent/bundle/compat";

import { globalErrorReporter } from "../errors";

export default function getMessage<T extends {}>(
  bundles: FluentBundle[],
  key: string,
  defaultTo: string,
  args?: T
): string {
  const res = bundles.reduce((val, bundle) => {
    const message = bundle.getMessage(key);
    if (!message) {
      // Warn in development about missing translations.
      if (bundle.locales.includes("en-US")) {
        // Report missing english translations!
        globalErrorReporter.report(`Missing English translation for "${key}"`);
      } else if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(`Translation ${key} was not found for ${bundle.locales}`);
      }
    }

    // If the message, message value, or args are not available, just continue.
    if (!message || !message.value || !args) {
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

  return res || defaultTo;
}
