import { GraphQLResolveInfo } from "graphql";
import { ResolverFn, withFilter } from "graphql-subscriptions";

import { SubscriptionResolver } from "coral-server/graph/schema/__generated__/types";
import GraphContext from "../../context";
import { SUBSCRIPTION_CHANNELS, SubscriptionPayload } from "./types";

type FilterFn<TParent, TArgs, TContext> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

type Resolver<TParent, TArgs, TResult> = (
  source: TParent,
  args: TArgs,
  ctx: GraphContext,
  info: GraphQLResolveInfo
) => TResult;

function createTenantAsyncIterator<TParent, TArgs, TResult>(
  channel: SUBSCRIPTION_CHANNELS
): Resolver<TParent, TArgs, AsyncIterator<TResult>> {
  return (source, args, ctx) =>
    // This is already technically returning an AsyncIterable, the Typescript
    // types are in fact wrong:
    //
    // https://github.com/davidyaha/graphql-redis-subscriptions/pull/255
    //
    ctx.pubsub.asyncIterator<TResult>(
      createSubscriptionChannelName(ctx.tenant.id, channel)
    );
}

export function createSubscriptionChannelName(
  tenantID: string,
  channel: SUBSCRIPTION_CHANNELS
): string {
  return `TENANT[${tenantID}][${channel}]`;
}

/**
 * clientIDFilterFn will perform filtering operations on the subscription
 * responses to ensure that mutations issued by one user is not sent back as a
 * subscription to the same requesting User, as they already implement the
 * update via the mutation response.
 *
 * @param source the source for the document passed down, we don't actually need
 *               it here.
 * @param args the arguments for the specific subscription operation, we don't
 *             actually need it here.
 * @param ctx the context for the request, this contains the references we'll
 *            need to determine eligibility to send the subscription back or
 *            not.
 */
export function clientIDFilterFn<TParent extends SubscriptionPayload, TArgs>(
  source: TParent,
  args: TArgs,
  ctx: GraphContext
): boolean {
  if (source.clientID && ctx.clientID && source.clientID === ctx.clientID) {
    return false;
  }

  return true;
}

function composeFilters<TParent, TArgs>(
  ...filters: Array<FilterFn<TParent, TArgs, GraphContext>>
): FilterFn<TParent, TArgs, GraphContext> {
  return (source, args, ctx, info) =>
    filters.every((filter) => filter(source, args, ctx, info));
}

export interface CreateIteratorInput<TParent, TArgs, TResult> {
  filter: FilterFn<TParent, TArgs, GraphContext>;
}

// NOTE (marcushaddon): if the createIterator function is in fact actually
// returning an iterable, this might break
const iteratorToIterable = <T extends any>(
  itor: AsyncIterator<T>
): AsyncIterable<T> => ({
  [Symbol.asyncIterator]() {
    return itor;
  },
});

export function createIterator<
  TResult,
  TKey extends string,
  TParent extends SubscriptionPayload,
  TContext,
  TArgs
>(
  channel: SUBSCRIPTION_CHANNELS,
  { filter }: CreateIteratorInput<TParent, TArgs, TResult>
): SubscriptionResolver<TResult, TKey, TParent, TContext, TArgs> {
  const subscribeInner: ResolverFn = withFilter(
    createTenantAsyncIterator(channel),
    composeFilters(clientIDFilterFn, filter)
  );
  const wrapped = (rootValue?: any, args?: any, context?: any, info?: any) => {
    const inner = subscribeInner(rootValue, args, context, info);
    return iteratorToIterable(inner);
  };
  return {
    subscribe: wrapped,
    resolve: (payload: TResult) => payload,
  };
}
