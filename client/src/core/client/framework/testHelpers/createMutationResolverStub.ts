import { omit } from "lodash";
import sinon from "sinon";

import { Fixture } from "./createFixture";
import { Resolver } from "./createTestContext";

export type NoClientMutationID<T> = T extends { clientMutationId: any }
  ? Omit<T, "clientMutationId">
  : T;

export type MutationResult<T> = NoClientMutationID<Fixture<T>>;
export type MutationResultVariations<T> = T extends Resolver<any, infer R>
  ? MutationResult<R>
  : never;

export type MutationResolverCallback<T extends Resolver<any, any>> = (data: {
  variables: T extends Resolver<infer V, any>
    ? V extends { input: infer W }
      ? NoClientMutationID<W>
      : never
    : never;
  callCount: number;
}) => MutationResultVariations<T>;

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
    const result = callback({
      // TODO: Remove this exception, linting error shouldn't be there.
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      variables: omit(data.input, "clientMutationId") as any,
      callCount: callCount++,
    });
    expectAndFail(result.clientMutationId).toBeUndefined();
    result.clientMutationId = clientMutationId;
    return result;
  };
  return sinon.stub().callsFake(resolver);
}
