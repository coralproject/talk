import { FluentBundle } from "fluent/compat";

export default function getMessage(
  bundles: FluentBundle[],
  key: string,
  defaultTo = ""
): string {
  const res = bundles.reduce((val, bundle) => {
    const got = bundle.getMessage(key);
    if (!got && process.env.NODE_ENV !== "production") {
      // tslint:disable-next-line:no-console
      console.warn(`Translation ${key} was not found for ${bundle.locales}`);
    }
    return val || got;
  }, "");
  return res || defaultTo;
}
