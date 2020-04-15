import { GQLQueuesTypeResolver } from "../schema/__generated__/types";

import GraphContext from "../context";
import { QueueInput } from "./Queue";

/**
 * get produces a resolver that maps the context to a QueueInput.
 *
 * @param fn the function to map the ctx to the queue.
 */
const get = (fn: (ctx: GraphContext) => QueueInput) => (
  parent: any,
  args: any,
  ctx: GraphContext
) => fn(ctx);

export const Queues: Required<GQLQueuesTypeResolver> = {
  mailer: get((ctx) => ctx.mailerQueue),
  scraper: get((ctx) => ctx.scraperQueue),
  notifier: get((ctx) => ctx.notifierQueue),
  webhook: get((ctx) => ctx.webhookQueue),
  rejector: get((ctx) => ctx.rejectorQueue),
};
