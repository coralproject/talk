import qs from "querystringify";

/**
 * From the `querystringify` project:
 * The parse method transforms a given query string in to an object.
 * Parameters without values are set to empty strings.
 * It does not care if your query string is prefixed with a ? or not.
 * It just extracts the parts between the = and &:
 */
export { parse } from "querystringify";

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
export function stringify(obj: object, prefix?: string | boolean): string {
  const copy: any = { ...obj };
  Object.keys(copy).forEach(key => {
    if (copy[key] === undefined) {
      delete copy[key];
    }
  });
  return qs.stringify(copy, prefix);
}
