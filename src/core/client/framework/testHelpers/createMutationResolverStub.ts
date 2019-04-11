import { identity, omit } from "lodash";
import sinon from "sinon";
import { Omit } from "talk-framework/types";

import { Fixture } from "./createFixture";
import { Resolver } from "./createTestRenderer";

export type NoClientMutationID<T> = T extends { clientMutationId: any }
  ? Omit<T, "clientMutationId">
  : T;

export type MutationResult<T> = NoClientMutationID<Fixture<T>>;
export type MutationResultVariations<T> = T extends Resolver<any, infer R>
  ? MutationResult<R>
  : never;

export type MutationResolverCallback<T extends Resolver<any, any>> = (
  data: {
    variables: T extends Resolver<infer V, any>
      ? V extends { input: infer W } ? NoClientMutationID<W> : never
      : never;
    callCount: number;
    typecheck: (
      data: MutationResultVariations<T>
    ) => MutationResultVariations<T>;
  }
) => MutationResultVariations<T>;

/**
 * createMutationResolverStub makes it easier to write a SinonStub.
 * Given a `ResolverType` from the Schema it'll provide types as well!.
 */
export default function createMutationResolverStub<
  T extends Resolver<any, any>
>(callback: MutationResolverCallback<T>) {
  let callCount = 0;
  const lastClientMutationIds: any[] = [];
  const resolver = async (_: any, data: any) => {
    const clientMutationId = data.input.clientMutationId;
    expectAndFail(clientMutationId).toBeTruthy();
    expectAndFail(lastClientMutationIds).not.toContain(clientMutationId);
    lastClientMutationIds.push(clientMutationId);
    const result = await callback({
      variables: omit(data.input, "clientMutationId"),
      callCount: callCount++,
      typecheck: identity,
    });
    expectAndFail(result.clientMutationId).toBeUndefined();
    result.clientMutationId = clientMutationId;
    return result;
  };
  return sinon.stub().callsFake(resolver);
}
