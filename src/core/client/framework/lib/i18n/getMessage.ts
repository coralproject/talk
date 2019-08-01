import { FluentBundle } from "fluent/compat";

export default function getMessage<T extends {}>(
  bundles: FluentBundle[],
  key: string,
  defaultTo: string,
  args?: T
): string {
  const res = bundles.reduce((val, bundle) => {
    const message = bundle.getMessage(key);
    if (!message && process.env.NODE_ENV !== "production") {
      // tslint:disable-next-line:no-console
      console.warn(`Translation ${key} was not found for ${bundle.locales}`);
    }
    if (!args) {
      return val || message;
    }
    return val || bundle.format(message, args);
  }, "");
  if (res && Array.isArray(res)) {
    return res.join("");
  }

  return res || defaultTo;
}
