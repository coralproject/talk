import sinon from "sinon";

type Resolver<V, R> = (parent: any, args: V, context: any, info: any) => R;

export default function createQueryResolverStub<T extends Resolver<any, any>>(
  callback: (
    variables: T extends Resolver<infer V, any> ? V : never,
    callCount: number
  ) => T extends Resolver<any, infer R>
    ? R extends Promise<infer U> ? U | R : R | Promise<R>
    : never
) {
  let callCount = 0;
  return sinon
    .stub()
    .callsFake((_: any, data: any) => callback(data, callCount++));
}
