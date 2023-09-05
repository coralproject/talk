import { FluentBundle } from "@fluent/bundle/compat";

import { globalErrorReporter } from "../errors";

function getMessageFromBundle<T extends {}>(
  bundle: FluentBundle,
  key: string,
  args?: T
) {
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
  if (!message || !message.value) {
    return "";
  }

  const errors: Error[] = [];
  const formatted = bundle.formatPattern(message.value, args || {}, errors);
  if (errors.length > 0) {
    globalErrorReporter.report(
      `Translation ${key} encountered an error: ${errors
        .map((err) => err.message)
        .join(", ")}`
    );
    return "";
  }

  // @cvle: Does this really happen? (@wyattjoh)
  if (formatted && Array.isArray(formatted)) {
    return formatted.join("");
  }

  return formatted;
}

export default function getMessage<T extends {}>(
  bundles: FluentBundle[],
  key: string,
  defaultTo: string,
  args?: T
): string {
  const result = bundles.reduce(
    (val, bundle) => (val ? val : getMessageFromBundle<T>(bundle, key, args)),
    ""
  );
  return result || defaultTo;
}
