import { GQLQueryTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";

const Query: GQLQueryTypeResolver<void> = {
  story: (source, args, ctx) => ctx.loaders.Stories.findOrCreate(args),
  comment: (source, { id }, ctx) =>
    id ? ctx.loaders.Comments.comment.load(id) : null,
  settings: (source, args, ctx) => ctx.tenant,
  me: (source, args, ctx) => ctx.user,
  discoverOIDCConfiguration: (source, { issuer }, ctx) =>
    ctx.loaders.Auth.discoverOIDCConfiguration.load(issuer),
  debugScrapeStoryMetadata: (source, { url }, ctx) =>
    ctx.loaders.Stories.debugScrapeMetadata.load(url),
};

export default Query;
