import createQueryResolverStub, {
  QueryResolverCallback,
} from "./createQueryResolverStub";
import { Resolver, Resolvers, TestResolvers } from "./createTestContext";

type ValueOrCallbackRecursive<T> = {
  [P in keyof T]?: ValueOrCallbackRecursive<T[P]> | (() => void);
};

type ResolverResult<T extends Resolver<any, any>> = T extends Resolver<
  any,
  infer R
>
  ? R
  : never;

type OverwriteQueryResolverTemplate<T extends Resolvers = any> = {
  [P in keyof Required<T>["Query"]]: ValueOrCallbackRecursive<
    ResolverResult<Required<T>["Query"][P]>
  >;
};

/**
 * overwriteRecursive will loop over the original resolver object
 * and creates a resolver function of each of its field. The returned
 * value of the resolvers will bet the value returned by the overwrite
 * or if undefined, the original value.
 *
 * @param original original resolver object
 * @param overwrite overwrite resolver object or value
 */
function overwriteRecursive(original: any, overwrite: any) {
  let ret = original;
  Object.keys(overwrite).forEach((k) => {
    ret = {
      ...original,
      [k]: (...args: any[]) => {
        // Only resolve original resolver when needed.
        const resolve = () =>
          typeof original[k] === "function"
            ? original[k](...args)
            : original[k];

        // There is an overwrite defined!
        if (overwrite[k]) {
          // It's a resolver function, we reached a leaf.
          if (typeof overwrite[k] === "function") {
            // Resolve overwrite resolver and return it's value
            // or if undefined the original resolved value.
            const result = overwrite[k](...args);
            return result !== undefined ? result : resolve();
          }
          // The overwrite is an Object, so we will recurse into it,
          // until we find a leaf.
          if (overwrite[k] instanceof Object && !Array.isArray(overwrite[k])) {
            return overwriteRecursive(resolve(), overwrite[k]);
          }
          // The overwrite is a fixed value, we use that.
          return overwrite[k];
        }

        // No overwrite defined, just resolve and return.
        return resolve();
      },
    };
  });
  return ret;
}

/**
 * `createQueryResolverOverwrite` is like `createQueryResolverStub`
 * but allows you to return `void` which would then fallback to the original resolver.
 *
 * Given a `ResolverType` from the Schema it'll provide types as well!.
 *
 * @param callback resolver callback
 */
export function createQueryResolverOverwrite<T extends Resolver<any, any>>(
  callback: QueryResolverCallback<Resolver<any, ResolverResult<T> | void>>
) {
  return createQueryResolverStub(callback);
}

/**
 * overwriteQueryResolver allows you to conveniently overwrite the Query resolvers,
 * even if you just want to overwrite a deeply nested field.
 *
 * When your overwrite resolver returns no value, it will fallback to the
 * original resolver.
 *
 * Example usage:
 * ```ts
 * {
 *   resolver: overwriteQueryResolver<GQLResolver>(params.resolvers || {}, {
 *     story: {
 *       comments: createQueryResolverOverwrite<StoryToCommentsResolver>(
 *         ({ variables }) => {
 *           if (variables.tag === "FEATURED") {
 *             return storyWithNoComments.comments;
 *           }
 *           return;
 *         }
 *       ),
 *     },
 *   }),
 * }
 * ```
 */
export default function overwriteQueryResolver<T extends Resolvers<any, any>>(
  original: TestResolvers<any>,
  overwriteQuery: OverwriteQueryResolverTemplate<T>
): TestResolvers<any> {
  return {
    ...original,
    Query: overwriteRecursive(original.Query || {}, overwriteQuery),
  };
}
