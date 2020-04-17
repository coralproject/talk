import {
  isArray,
  isNull,
  isNumber,
  isPlainObject,
  isString,
  isUndefined,
} from "lodash";

function isObject(obj: any): obj is Record<string, any> {
  return isPlainObject(obj);
}

function deriveKey(property: string, prefix?: string) {
  if (prefix) {
    return `${prefix}.${property}`;
  }

  return property;
}

interface ReduceOptions {
  result: Record<string, any>;
  obj: Record<string, any> | number | null | string;
  ignoreArrays: boolean;
  embedArrays: boolean;
  includeUndefined: boolean;
  prefix?: string;
}

function reduce({
  result,
  obj,
  ignoreArrays,
  embedArrays,
  includeUndefined,
  prefix,
}: ReduceOptions) {
  if (prefix) {
    if (isNumber(obj) || isString(obj) || isNull(obj)) {
      result[prefix] = obj;
      return result;
    }
  }

  if (isObject(obj)) {
    for (const property in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, property)) {
        continue;
      }

      const value = obj[property];
      const key = deriveKey(property, prefix);

      if (isPlainObject(value)) {
        reduce({
          result,
          obj: value,
          ignoreArrays,
          embedArrays,
          includeUndefined,
          prefix: key,
        });
      } else if (isArray(value)) {
        if (!ignoreArrays) {
          if (embedArrays) {
            result[key] = value;
          } else {
            value.forEach((item, index) => {
              reduce({
                result,
                obj: item,
                ignoreArrays,
                embedArrays,
                includeUndefined,
                prefix: `${key}[${index}]`,
              });
            });
          }
        }
      } else {
        // If the underlying value is undefined and we aren't including
        // undefined elements, then continue.
        if (!includeUndefined && isUndefined(value)) {
          continue;
        }

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

  /**
   * includeUndefined if true, will include undefined values in the result.
   */
  includeUndefined?: boolean;
}

export const dotize = (
  obj: Record<string, any>,
  {
    ignoreArrays = false,
    embedArrays = false,
    includeUndefined = false,
  }: DotizeOptions = {}
): Record<string, any> =>
  reduce({ result: {}, obj, ignoreArrays, embedArrays, includeUndefined });
