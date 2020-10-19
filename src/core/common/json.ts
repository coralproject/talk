const ISO_8601 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
function isISOString(value: string) {
  return ISO_8601.test(value);
}

const KEY = "$date";

function replacer(key: string, value: any) {
  // The JSON stringifier will perform it's work prior to using this replacer
  // function.
  if (typeof value === "string" && key !== KEY && isISOString(value)) {
    return { [KEY]: value };
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
  return JSON.stringify(data, replacer);
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
  if (typeof value === "object" && KEY in value && value[KEY] instanceof Date) {
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
