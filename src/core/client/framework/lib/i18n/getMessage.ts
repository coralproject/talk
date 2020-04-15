import { FluentBundle } from "@fluent/bundle/compat";

export default function getMessage<T extends {}>(
  bundles: FluentBundle[],
  key: string,
  defaultTo: string,
  args?: T
): string {
  const res = bundles.reduce((val, bundle) => {
    const message = bundle.getMessage(key);

    // Warn in development about missing translations.
    if (process.env.NODE_ENV !== "production" && !message) {
      window.console.warn(
        `Translation ${key} was not found for ${bundle.locales}`
      );
    }

    // If the message, message value, or args are not available, just continue.
    if (!message || !message.value || !args) {
      return val;
    }

    const errors: Error[] = [];
    const formatted = bundle.formatPattern(message.value, args, errors);
    if (process.env.NODE_ENV !== "production" && errors.length > 0) {
      window.console.warn(
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
