import { identity } from "lodash";
import sinon from "sinon";

import { Fixture } from "./createFixture";
import { Resolver } from "./createTestRenderer";

export type QueryResult<T> = Fixture<T>;
export type QueryResultVariations<
  T extends Resolver<any, any>
> = T extends Resolver<any, infer R> ? QueryResult<R> : never;

export type QueryResolverCallback<T extends Resolver<any, any>> = (data: {
  variables: T extends Resolver<infer V, any> ? V : never;
  callCount: number;
  typecheck: (data: QueryResultVariations<T>) => QueryResultVariations<T>;
}) => QueryResultVariations<T>;

/**
 * createQueryResolverStub makes it easier to write a SinonStub.
 * Given a `ResolverType` from the Schema it'll provide types as well!.
 */
export default function createQueryResolverStub<T extends Resolver<any, any>>(
  callback: QueryResolverCallback<T>
) {
  let callCount = 0;
  return sinon.stub().callsFake((fallback: any, variables: any) => {
    return callback({
      variables: variables || fallback,
      callCount: callCount++,
      typecheck: identity,
    });
  });
}
