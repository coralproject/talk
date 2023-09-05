import { isPlainObject } from "lodash";

/**
 * ISO 8601 defines a date format matching the following:
 *
 * 2020-10-19T18:53:23.478Z
 *
 * Which will always be in UTC.
 */
const ISO_8601_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

/**
 * isISOString will return true if the string matches a ISO 8601 date.
 *
 * @param value value to test if it matches the ISO 8601 format
 */
function isISOString(value: string) {
  return ISO_8601_PATTERN.test(value);
}

const KEY = "$date";

/**
 * transform will walk the passed object and transform any dates that it
 * encounters into special objects that can be parsed back into dates.
 *
 * @param value the value to transform
 */
function transform(value: any): any {
  // For each of the date objects encountered, transform the date object to be
  // a nested object.
  if (value instanceof Date) {
    return { [KEY]: value.toISOString() };
  }

  // If the value is a array, then for each element, transform it and return a
  // copy.
  if (Array.isArray(value)) {
    return value.map((element) => transform(element));
  }

  // If the value is a plain object (extending {}), then process each field by
  // itself and return a clone.
  if (isPlainObject(value)) {
    const copy: Record<string, any> = {};

    for (const key in value) {
      // eslint-disable-next-line no-prototype-builtins
      if (!value.hasOwnProperty(key)) {
        continue;
      }

      // Transform it's value, and save it on the copy.
      copy[key] = transform(value[key]);
    }

    return copy;
  }

  return value;
}

/**
 * stringify will serialize the data into JSON with special consideration for
 * Date values.
 *
 * @param data the data to stringify
 */
export function stringify(data: any) {
  return JSON.stringify(transform(data));
}

function reviver(key: string, value: any) {
  // The first time we encounter the date object, it will be at it's deepest
  // nesting, so it will currently be a string. Parse the string, and return it
  // so that we can parse it and return it.
  if (typeof value === "string" && key === KEY && isISOString(value)) {
    try {
      return new Date(value);
    } catch {
      return value;
    }
  }

  // The next time we encounter the date object, it will be parsed as a date,
  // but still nested within the `{ [KEY]: DATE }` object. We then should
  // transform it back to the `DATE` value.
  if (
    isPlainObject(value) &&
    KEY in value &&
    Object.keys(value).length === 1 &&
    value[KEY] instanceof Date
  ) {
    return value[KEY];
  }

  return value;
}

/**
 * parse will parse deserialize the data from JSON with support for Date values
 * that have been encoded with stringify.
 *
 * @param data the data to parse
 */
export function parse(data: string) {
  return JSON.parse(data, reviver);
}
