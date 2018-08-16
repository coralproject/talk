import { isArray, isNull, isNumber, isPlainObject, isString } from "lodash";

function isObject(obj: any): obj is Record<string, any> {
  return isPlainObject(obj);
}

function deriveKey(property: string, prefix?: string) {
  if (prefix) {
    return `${prefix}.${property}`;
  }

  return property;
}

function reduce(
  result: Record<string, any>,
  obj: Record<string, any> | number | null | string,
  ignoreArrays: boolean,
  embedArrays: boolean,
  prefix?: string
) {
  if (prefix) {
    if (isNumber(obj) || isString(obj) || isNull(obj)) {
      result[prefix] = obj;
      return result;
    }
  }

  if (isObject(obj)) {
    for (const property in obj) {
      if (!obj.hasOwnProperty(property)) {
        continue;
      }

      const value = obj[property];
      const key = deriveKey(property, prefix);

      if (isPlainObject(value)) {
        reduce(result, value, ignoreArrays, embedArrays, key);
      } else if (isArray(value)) {
        if (!ignoreArrays) {
          if (embedArrays) {
            result[key] = value;
          } else {
            value.forEach((item, index) => {
              reduce(
                result,
                item,
                ignoreArrays,
                embedArrays,
                `${key}[${index}]`
              );
            });
          }
        }
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

export interface DotizeOptions {
  /**
   * ignoreArrays will ignore all array properties and not include them in the
   * resulting entry.
   */
  ignoreArrays?: boolean;

  /**
   * embedArrays will treat arrays as plain objects, and embed them as is
   * without recusing the dotize algorithm to it.
   */
  embedArrays?: boolean;
}

export const dotize = (
  obj: Record<string, any>,
  { ignoreArrays = false, embedArrays = false }: DotizeOptions = {}
): Record<string, any> => reduce({}, obj, ignoreArrays, embedArrays);
