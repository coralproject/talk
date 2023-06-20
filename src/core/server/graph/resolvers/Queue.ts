import GraphContext from "../context";
import {
  GQLQueueCounts,
  GQLQueueResolvers,
} from "../schema/__generated__/types";

export interface QueueInput {
  counts(): Promise<GQLQueueCounts>;
}

export const Queue: Required<GQLQueueResolvers<GraphContext, QueueInput>> = {
  counts: (t) => t.counts(),
};
