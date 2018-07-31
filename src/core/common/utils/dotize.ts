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
  ignoreArrays?: boolean,
  prefix?: string
) {
  for (const property in obj) {
    if (!obj.hasOwnProperty(property)) {
      continue;
    }

    const value = obj[property];
    const key = deriveKey(property, prefix);

    if (isPlainObject(value)) {
      reduce(result, value, ignoreArrays, key);
    } else if (isArray(value)) {
      if (!ignoreArrays) {
        value.forEach((item, index) => {
          reduce(result, item, ignoreArrays, `${key}[${index}]`);
        });
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}

export const dotize = (
  obj: Record<string, any>,
  ignoreArrays?: boolean
): Record<string, any> => reduce({}, obj, ignoreArrays);
