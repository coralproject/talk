import { GraphQLResolveInfo } from "graphql";

import GraphContext from "../../context";
import { SUBSCRIPTION_CHANNELS, SubscriptionPayload } from "./types";

type ResolverFn<TParent, TArgs, TContext> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<any>;

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

interface SubscriptionResolver<TParent, TArgs, TResult> {
  subscribe: Resolver<TParent, TArgs, AsyncIterator<TResult>>;
  resolve: Resolver<TParent, TArgs, TParent>;
}

/**
 * withFilter applies a filter to a async iterator.
 *
 * This duplicates the functionality of the withFilter function provided by the
 * `graphql-subscriptions` package without the memory leak as it uses native
 * async iterators instead.
 *
 * Solution provided by @brettjashford.
 *
 * https://github.com/apollographql/graphql-subscriptions/pull/209#issuecomment-713906710
 *
 * @param asyncIteratorFn the async iterator to use that's provided by the transport
 * @param filterFn the filter to apply for each iteration to check to see if we should sent it
 */
function withFilter<TParent, TArgs>(
  asyncIteratorFn: ResolverFn<TParent, TArgs, GraphContext>,
  filterFn: FilterFn<TParent, TArgs, GraphContext>
) {
  return async function* (
    source: TParent,
    args: TArgs,
    ctx: GraphContext,
    info: GraphQLResolveInfo
  ) {
    const asyncIterator = asyncIteratorFn(source, args, ctx, info);
    for await (const payload of asyncIterator) {
      if (await filterFn(payload, args, ctx, info)) {
        yield payload;
      }
    }
  };
}

function createTenantAsyncIterator<TParent, TArgs, TResult>(
  channel: SUBSCRIPTION_CHANNELS
): Resolver<TParent, TArgs, AsyncIterable<TResult>> {
  return (source, args, ctx) =>
    // This is already technically returning an AsyncIterable, the Typescript
    // types are in fact wrong:
    //
    // https://github.com/davidyaha/graphql-redis-subscriptions/pull/255
    //
    (ctx.pubsub.asyncIterator<TResult>(
      createSubscriptionChannelName(ctx.tenant.id, channel)
    ) as unknown) as AsyncIterable<TResult>;
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

export function createIterator<
  TParent extends SubscriptionPayload,
  TArgs,
  TResult
>(
  channel: SUBSCRIPTION_CHANNELS,
  { filter }: CreateIteratorInput<TParent, TArgs, TResult>
): SubscriptionResolver<TParent, TArgs, TResult> {
  return {
    subscribe: withFilter(
      createTenantAsyncIterator(channel),
      composeFilters(clientIDFilterFn, filter)
    ),
    resolve: (payload) => payload,
  };
}
