import sinon from "sinon";
import { Mutation } from "talk-framework/lib/relay/mutation";

export default function createMutationResolverStub<
  T extends Mutation<any, any, any>
>(
  callback: (
    variables: T extends Mutation<any, infer I, any> ? I : never,
    callCount: number
  ) => T extends Mutation<any, any, infer R>
    ? R extends Promise<infer U> ? U | R : R | Promise<R>
    : never
) {
  let callCount = 0;
  const lastClientMutationIds: any[] = [];
  const resolver = async (_: any, data: any) => {
    const clientMutationId = data.input.clientMutationId;
    expectAndFail(clientMutationId).toBeTruthy();
    expectAndFail(lastClientMutationIds).not.toContain(clientMutationId);
    lastClientMutationIds.push(clientMutationId);
    const result = await callback(data.input, callCount++);
    expectAndFail(result.clientMutationId).toBeUndefined();
    result.clientMutationId = clientMutationId;
    return result;
  };
  return sinon.stub().callsFake(resolver);
}
