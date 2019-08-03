import { FluentBundle } from "fluent/compat";

export default function format(
  bundles: FluentBundle[],
  key: string,
  args?: object
): string {
  const res = bundles.reduce((val, bundle) => {
    const message = bundle.getMessage(key);
    const got = bundle.format(message, args);
    return val || got;
  }, "");
  if (res && Array.isArray(res)) {
    return res.join("");
  }

  return res || "";
}
