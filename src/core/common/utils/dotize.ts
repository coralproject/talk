import { isArray, isPlainObject } from "lodash";

function deriveKey(property: string, prefix?: string) {
  if (prefix) {
    return `${prefix}.${property}`;
  }

  return property;
}

function reduce(
  result: Record<string, any>,
  obj: Record<string, any>,
  prefix?: string
) {
  for (const property in obj) {
    if (!obj.hasOwnProperty(property)) {
      continue;
    }

    const value = obj[property];
    const key = deriveKey(property, prefix);

    if (isPlainObject(value)) {
      reduce(result, value, key);
    } else if (isArray(value)) {
      throw new Error("arrays are not supported");
    } else {
      result[key] = value;
    }
  }

  return result;
}

export const dotize = (obj: Record<string, any>): Record<string, any> =>
  reduce({}, obj);
