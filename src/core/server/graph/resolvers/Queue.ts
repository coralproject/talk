import GraphContext from "../context";
import {
  GQLQueueCounts,
  GQLQueueResolvers,
} from "../schema/__generated__/types";
import RequiredResolver from "./RequireResolver";

export interface QueueInput {
  counts(): Promise<GQLQueueCounts>;
}

export const Queue: RequiredResolver<
  GQLQueueResolvers<GraphContext, QueueInput>
> = {
  counts: (t) => t.counts(),
};
