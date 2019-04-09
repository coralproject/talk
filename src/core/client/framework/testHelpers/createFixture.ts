import { merge } from "lodash";

/**
 * Fixture prepares schema type to be used in fixtures.
 * It adds an optional `__typename` to the schema type and
 * marks fields as optional.
 */
export type Fixture<T> = T extends object
  ? {
      // (cvle): We don't use & { __typename?: string } because for some reason
      // typescript would allow field names that are not defined!
      [P in keyof T | "__typename"]?: P extends keyof T
        ? T[P] extends Array<infer U>
          ? Array<Fixture<U>>
          : T[P] extends ReadonlyArray<infer V>
            ? ReadonlyArray<Fixture<V>>
            : Fixture<T[P]>
        : string
    }
  : T;

/**
 * createFixture lets you input the data of a schema object as deep partial
 * including it's `__typename`, merged it with `base` and return it as the
 * schema object's type. In the future the result could be trimmed down
 * to only include fields that exists in `data` and `base` though to
 * type this it seems we need partial generic inferation support.
 */
export default function createFixture<T>(data: Fixture<T>, base?: T): T {
  if (base) {
    return merge({}, base, data);
  }
  return data as T;
}
