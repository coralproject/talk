import createFixture, { Fixture } from "./createFixture";

/**
 * createFixtures lets you input an array of data of a schema object as deep partial
 * including it's `__typename`, merged it with `base` and return it as any array of the
 * schema object's type. In the future the result could be trimmed down
 * to only include fields that exists in `data` and `base` though to
 * type this it seems we need partial generic inferation support.
 */
export default function createFixtures<T>(
  data: Array<Fixture<T>>,
  base?: T
): T[] {
  return data.map(d => createFixture(d, base)) as T[];
}
