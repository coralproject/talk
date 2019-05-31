import { GQLQueryTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";

import { moderationQueuesResolver } from "./ModerationQueues";

export const Query: Required<GQLQueryTypeResolver<void>> = {
  story: (source, args, ctx) =>
    ctx.tenant.stories.disableLazy
      ? ctx.loaders.Stories.find.load(args)
      : ctx.loaders.Stories.findOrCreate.load(args),
  stories: (source, args, ctx) => ctx.loaders.Stories.connection(args),
  user: (source, args, ctx) => ctx.loaders.Users.user.load(args.id),
  users: (source, args, ctx) => ctx.loaders.Users.connection(args),
  comment: (source, { id }, ctx) =>
    id ? ctx.loaders.Comments.comment.load(id) : null,
  comments: (source, args, ctx) => ctx.loaders.Comments.forFilter(args),
  settings: (source, args, ctx) => ctx.tenant,
  viewer: (source, args, ctx) => ctx.user,
  discoverOIDCConfiguration: (source, { issuer }, ctx) =>
    ctx.loaders.Auth.discoverOIDCConfiguration.load(issuer),
  debugScrapeStoryMetadata: (source, { url }, ctx) =>
    ctx.loaders.Stories.debugScrapeMetadata.load(url),
  moderationQueues: moderationQueuesResolver,
};
