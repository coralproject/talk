import { mapValues } from "lodash";
import { SinonStub } from "sinon";

import createMutationResolverStub, {
  MutationResolverCallback,
} from "./createMutationResolverStub";
import createQueryResolverStub, {
  QueryResolverCallback,
} from "./createQueryResolverStub";
import { Resolvers } from "./createTestRenderer";

export interface ResolversTemplate<T extends Resolvers = any> {
  Query?: {
    [P in keyof Required<T>["Query"]]: QueryResolverCallback<
      Required<T>["Query"][P]
    >
  };
  Mutation?: {
    [P in keyof Required<T>["Mutation"]]: MutationResolverCallback<
      Required<T>["Mutation"][P]
    >
  };
}

export interface ResolversStub<T extends Resolvers = any> {
  Query?: { [P in keyof Required<T>["Query"]]: SinonStub };
  Mutation?: { [P in keyof Required<T>["Mutation"]]: SinonStub };
}

function isSinonStub(v: any) {
  return v.called !== undefined;
}

/**
 * createResolversStub is a helper for creating resolvers.
 *
 * Instead of writing:
 * ```ts
 * {
 *   Query: {
 *     settings: createQueryResolverStub<QueryToSettingsResolver>(({ variables }) => settings)
 *     users: createQueryResolverStub<QueryToUsersResolver>(() => users)
 *     viewer: createQueryResolverStub<QueryToSettingsResolver>(() => viewer)
 *   },
 *   Mutation: {
 *     // Same goes for Mutations
 *   }
 * },
 * ```
 *
 * You can do
 * ```ts
 * createResolversStub<GQLResolver>({
 *   Query: {
 *     settings: ({ variables }) => settings
 *     users: () => users
 *     viewer: () => viewer
 *   },
 *   Mutation: {
 *     // Same goes for Mutations
 *   }
 * }),
 * ```
 */
export default function createResolversStub<T extends Resolvers = any>(
  resolvers: ResolversTemplate<T>
): ResolversStub<T> {
  const result: any = {};
  if (resolvers.Query) {
    result.Query = mapValues(
      resolvers.Query,
      v =>
        typeof v === "function" && !isSinonStub(v)
          ? createQueryResolverStub(v)
          : v
    );
  }
  if (resolvers.Mutation) {
    result.Mutation = mapValues(
      resolvers.Mutation,
      v =>
        typeof v === "function" && !isSinonStub(v)
          ? createMutationResolverStub(v)
          : v
    );
  }
  return result;
}
