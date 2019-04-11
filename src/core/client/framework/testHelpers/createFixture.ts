import { pureMerge } from "talk-common/utils";
import { DeepPartial } from "talk-framework/types";

/**
 * Callbackify turns Fields e.g. `{a: string}`
 * to also allow a callback `{a: string | () => string}`
 */
export type Callbackify<T> = T extends object
  ?
      | {
          [P in keyof T]: T[P] extends Array<infer U>
            ? Array<Callbackify<U>>
            : T[P] extends ReadonlyArray<infer V>
            ? ReadonlyArray<Callbackify<V>>
            : Callbackify<T[P]>
        }
      | (() => {
          [P in keyof T]: T[P] extends Array<infer U>
            ? Array<Callbackify<U>>
            : T[P] extends ReadonlyArray<infer V>
            ? ReadonlyArray<Callbackify<V>>
            : Callbackify<T[P]>
        })
  : T | (() => T);

/**
 * WithTypename adds `__typename` to allowed props deeply.
 */
export type WithTypename<T> = T extends object
  ? {
      [P in keyof T]: T[P] extends Array<infer U>
        ? Array<WithTypename<U>>
        : T[P] extends ReadonlyArray<infer V>
        ? ReadonlyArray<WithTypename<V>>
        : WithTypename<T[P]>
    } & { __typename?: string }
  : T;

/**
 * Fixture adds typenames and is deeply partial.
 */
export type Fixture<T> = DeepPartial<WithTypename<T>>;

/**
 * createFixture lets you input the data of a schema object as deep partial
 * including it's `__typename`, merged it with `base` and return it as the
 * schema object's type. In the future the result could be trimmed down
 * to only include fields that exists in `data` and `base` though to
 * type this it seems we need partial generic inferation support.
 */
export default function createFixture<T>(
  data: Fixture<T>,
  base?: T
): WithTypename<T> {
  if (base) {
    return pureMerge(base, data) as any;
  }
  return data as any;
}
