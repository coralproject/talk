import { GQLQueryTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

import { sharedModerationInputResolver } from "./ModerationQueues";

export const Query: Required<GQLQueryTypeResolver<void>> = {
  story: (source, args, ctx) => ctx.loaders.Stories.findOrCreate.load(args),
  stories: (source, args, ctx) => ctx.loaders.Stories.connection(args),
  user: (source, args, ctx) => ctx.loaders.Users.user.load(args.id),
  users: (source, args, ctx) => ctx.loaders.Users.connection(args),
  comment: (source, { id }, ctx) =>
    id ? ctx.loaders.Comments.comment.load(id) : null,
  comments: (source, args, ctx) => ctx.loaders.Comments.forFilter(args),
  settings: (source, args, ctx) => ctx.tenant,
  me: (source, args, ctx) => ctx.user,
  discoverOIDCConfiguration: (source, { issuer }, ctx) =>
    ctx.loaders.Auth.discoverOIDCConfiguration.load(issuer),
  debugScrapeStoryMetadata: (source, { url }, ctx) =>
    ctx.loaders.Stories.debugScrapeMetadata.load(url),
  moderationQueues: sharedModerationInputResolver,
};
