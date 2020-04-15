import { GraphQLResolveInfo } from "graphql";
import { withFilter } from "graphql-subscriptions";

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

interface SubscriptionResolver<TParent, TArgs, TResult> {
  subscribe: Resolver<TParent, TArgs, AsyncIterator<TResult>>;
  resolve: Resolver<TParent, TArgs, TParent>;
}

export function createTenantAsyncIterator<TParent, TArgs, TResult>(
  channel: SUBSCRIPTION_CHANNELS
): Resolver<TParent, TArgs, AsyncIterator<TResult>> {
  return (source, args, ctx) =>
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
 * defaultFilterFn will perform filtering operations on the subscription
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
export function defaultFilterFn<TParent extends SubscriptionPayload, TArgs>(
  source: TParent,
  args: TArgs,
  ctx: GraphContext
): boolean {
  if (source.clientID && ctx.clientID && source.clientID === ctx.clientID) {
    return false;
  }

  return true;
}

/**
 * Ensure that even when we're provided with a domain specific filtering
 * function we respect the subscription id that is sent back with the request to
 * prevent double responses.
 */
export function createFilterFn<TParent, TArgs>(
  filter?: FilterFn<TParent, TArgs, GraphContext>
): FilterFn<TParent, TArgs, GraphContext> {
  return filter
    ? // Combine the filters, preferring the defaultFilterFn first.
      (source, args, ctx, info) => {
        if (!defaultFilterFn(source, args, ctx)) {
          return false;
        }

        return filter(source, args, ctx, info);
      }
    : defaultFilterFn;
}

export interface CreateIteratorInput<TParent, TArgs, TResult> {
  filter?: FilterFn<TParent, TArgs, GraphContext>;
}

export function createIterator<
  TParent extends SubscriptionPayload,
  TArgs,
  TResult
>(
  channel: SUBSCRIPTION_CHANNELS,
  { filter }: CreateIteratorInput<TParent, TArgs, TResult> = {}
): SubscriptionResolver<TParent, TArgs, TResult> {
  return {
    subscribe: withFilter(
      createTenantAsyncIterator(channel),
      createFilterFn(filter)
    ),
    resolve: (payload) => payload,
  };
}
