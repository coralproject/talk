import {
  CommentConnectionInput,
  CommentModerationCountsPerQueue,
} from "coral-server/models/comment";
import { FilterQuery } from "coral-server/models/helpers";
import { Site } from "coral-server/models/site";
import { Story } from "coral-server/models/story";
import { hasFeatureFlag } from "coral-server/models/tenant";
import {
  PENDING_STATUS,
  REPORTED_STATUS,
  UNMODERATED_STATUSES,
} from "coral-server/services/comments/moderation/counts";

import {
  GQLFEATURE_FLAG,
  GQLModerationQueuesTypeResolver,
  GQLSectionFilter,
  QueryToModerationQueuesResolver,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import { ModerationQueueInput } from "./ModerationQueue";

interface ModerationQueuesInput {
  connection: Partial<CommentConnectionInput>;
  counts?: CommentModerationCountsPerQueue;
}

const mergeModerationInputFilters =
  (
    filter: FilterQuery<Comment>,
    selector: keyof CommentModerationCountsPerQueue
  ) =>
  (input: ModerationQueuesInput): ModerationQueueInput => ({
    selector,
    connection: {
      ...input.connection,
      filter: {
        ...input.connection.filter,
        ...filter,
      },
    },
    count: input.counts ? input.counts[selector] : null,
  });

/**
 * siteModerationInputResolver can be used to retrieve the moderationQueue for
 * a specific site.
 *
 * @param site the site that will be used to base the comment moderation
 *              queues on
 */
export const siteModerationInputResolver = async (
  site: Site
): Promise<ModerationQueuesInput> => ({
  connection: {
    filter: {
      // This moderationQueues is being sourced from the Story, so require
      // that all the comments for theses queues are also for this Story.
      siteID: site.id,
    },
  },
  counts: site.commentCounts.moderationQueue.queues,
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
      siteID: story.siteID,
    },
  },
  counts: story.commentCounts.moderationQueue.queues,
});

/**
 * sectionModerationInputResolver can be used to retrieve the moderationQueue for
 * a specific Story.
 *
 * @param section the section that will be used to base the comment moderation
 *              queues on
 */
export const sectionModerationInputResolver = async (
  section: GQLSectionFilter
): Promise<ModerationQueuesInput> => ({
  connection: {
    filter: {
      // This moderationQueues is being sourced from the section, so require
      // that all the comments for theses queues are also for this section.
      section: section.name || null,
    },
  },
});

/**
 * sharedModerationInputResolver implements the resolver function style which
 * allows it to be used in a type resolver.
 *
 * @param source the source of the type, not used
 * @param args the args of the type, not used
 * @param ctx the GraphContext that will be used to get the shared counts
 */
export const sharedModerationInputResolver = async (
  source: any,
  args: any,
  ctx: GraphContext
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
 * @param ctx the GraphContext for which we can use to retrieve the shared data
 */
export const moderationQueuesResolver: QueryToModerationQueuesResolver = async (
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

  if (args.section && hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.SECTIONS)) {
    return sectionModerationInputResolver(args.section);
  }

  if (args.siteID) {
    const site = await ctx.loaders.Sites.site.load(args.siteID);
    if (!site) {
      return null;
    }

    return siteModerationInputResolver(site);
  }

  return sharedModerationInputResolver(source, args, ctx);
};

export const ModerationQueues: GQLModerationQueuesTypeResolver<ModerationQueuesInput> =
  {
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
