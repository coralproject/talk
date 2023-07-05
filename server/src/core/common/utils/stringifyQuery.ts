import qs from "querystringify";

/**
 * From the `querystringify` project:
 * This transforms a given object in to a query string.
 * By default we return the query string without a ? prefix.
 * If you want to prefix it by default simply supply true as second argument.
 * If it should be prefixed by something else simply supply a string with the
 * prefix value as second argument.
 *
 * In addition keys that have an undefined value are removed from the query.
 */
export default function stringifyQuery(
  obj: Record<string, any>,
  prefix?: string | boolean
): string {
  const copy: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) {
      return;
    }

    copy[key] = obj[key];
  });
  return qs.stringify(copy, prefix);
}
