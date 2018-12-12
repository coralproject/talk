import { GQLQueryTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

import { ModerationQueuesInput } from "./ModerationQueues";

export const Query: GQLQueryTypeResolver<void> = {
  story: (source, args, ctx) => ctx.loaders.Stories.findOrCreate.load(args),
  comment: (source, { id }, ctx) =>
    id ? ctx.loaders.Comments.comment.load(id) : null,
  comments: (source, args, ctx) => ctx.loaders.Comments.forFilter(args),
  settings: (source, args, ctx) => ctx.tenant,
  me: (source, args, ctx) => ctx.user,
  discoverOIDCConfiguration: (source, { issuer }, ctx) =>
    ctx.loaders.Auth.discoverOIDCConfiguration.load(issuer),
  debugScrapeStoryMetadata: (source, { url }, ctx) =>
    ctx.loaders.Stories.debugScrapeMetadata.load(url),
  moderationQueues: async (
    source,
    args,
    ctx
  ): Promise<ModerationQueuesInput> => ({
    // We don't need to filter the connection, as this is tenant wide (tenant
    // filtering is completed at the model layer).
    connection: {},
    counts: await ctx.loaders.Comments.sharedModerationQueueQueuesCounts.load(),
  }),
};
