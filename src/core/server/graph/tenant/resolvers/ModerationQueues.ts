import {
  ApproveCommentPayloadToModerationQueuesResolver,
  GQLModerationQueuesTypeResolver,
  QueryToModerationQueuesResolver,
  RejectCommentPayloadToModerationQueuesResolver,
} from "coral-server/graph/tenant/schema/__generated__/types";
import { CommentConnectionInput } from "coral-server/models/comment";
import { FilterQuery } from "coral-server/models/helpers/query";
import {
  CommentModerationCountsPerQueue,
  Story,
} from "coral-server/models/story";
import {
  PENDING_STATUS,
  REPORTED_STATUS,
  UNMODERATED_STATUSES,
} from "coral-server/services/comments/moderation/counts";

import TenantContext from "../context";
import { ModerationQueueInput } from "./ModerationQueue";

interface ModerationQueuesInput {
  connection: Partial<CommentConnectionInput>;
  counts: CommentModerationCountsPerQueue;
}

const mergeModerationInputFilters = (
  filter: FilterQuery<Comment>,
  selector: keyof CommentModerationCountsPerQueue
) => (input: ModerationQueuesInput): ModerationQueueInput => ({
  selector,
  connection: {
    ...input.connection,
    filter: {
      ...input.connection.filter,
      ...filter,
    },
  },
  count: input.counts[selector],
});

/**
 * storyModerationInputResolver can be used to retrieve the moderationQueue for
 * a specific Story.
 *
 * @param story the story that will be used to base the comment moderation
 *              queues on
 */
export const storyModerationInputResolver = (
  story: Story
): ModerationQueuesInput => ({
  connection: {
    filter: {
      // This moderationQueues is being sourced from the Story, so require
      // that all the comments for theses queues are also for this Story.
      storyID: story.id,
    },
  },
  counts: story.commentCounts.moderationQueue.queues,
});

/**
 * sharedModerationInputResolver implements the resolver function style which
 * allows it to be used in a type resolver.
 *
 * @param source the source of the type, not used
 * @param args the args of the type, not used
 * @param ctx the TenantContext that will be used to get the shared counts
 */
export const sharedModerationInputResolver = async (
  source: any,
  args: any,
  ctx: TenantContext
): Promise<ModerationQueuesInput> => ({
  // We don't need to filter the connection, as this is tenant wide (tenant
  // filtering is completed at the model layer).
  connection: {},
  counts: await ctx.loaders.Comments.sharedModerationQueueQueuesCounts.load(),
});

/**
 * moderationQueuesResolver implements the resolver that resolves to the
 * shared moderation queues or if `storyID` is provided to the story moderation
 * queues.
 *
 * @param source the source of the payload, not used
 * @param args the args of the payload containing potentially a Story ID
 * @param ctx the TenantContext for which we can use to retrieve the shared data
 */
export const moderationQueuesResolver:
  | QueryToModerationQueuesResolver
  | ApproveCommentPayloadToModerationQueuesResolver
  | RejectCommentPayloadToModerationQueuesResolver = async (
  source,
  args,
  ctx
): Promise<ModerationQueuesInput | null> => {
  if (args.storyID) {
    const story = await ctx.loaders.Stories.story.load(args.storyID);
    if (!story) {
      return null;
    }

    return storyModerationInputResolver(story);
  }

  return sharedModerationInputResolver(source, args, ctx);
};

export const ModerationQueues: GQLModerationQueuesTypeResolver<
  ModerationQueuesInput
> = {
  unmoderated: mergeModerationInputFilters(
    {
      status: { $in: UNMODERATED_STATUSES },
    },
    "unmoderated"
  ),
  reported: mergeModerationInputFilters(
    {
      status: { $in: REPORTED_STATUS },
      "actionCounts.FLAG": { $gt: 0 },
    },
    "reported"
  ),
  pending: mergeModerationInputFilters(
    {
      status: { $in: PENDING_STATUS },
    },
    "pending"
  ),
};
