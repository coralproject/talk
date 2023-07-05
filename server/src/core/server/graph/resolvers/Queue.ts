import {
  GQLQueueCounts,
  GQLQueueTypeResolver,
} from "../schema/__generated__/types";

export interface QueueInput {
  counts(): Promise<GQLQueueCounts>;
}

export const Queue: Required<GQLQueueTypeResolver<QueueInput>> = {
  counts: (t) => t.counts(),
};
