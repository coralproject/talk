import { defaultTo } from "lodash";

import { ACTION_TYPE } from "coral-server/models/action/comment";
import {
  getEmailDomain,
  getExternalModerationPhase,
} from "coral-server/models/settings";
import { getWebhookEndpoint } from "coral-server/models/tenant";

import {
  GQLCOMMENT_FLAG_REPORTED_REASON,
  GQLCOMMENT_SORT,
  GQLQueryTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

import { moderationQueuesResolver } from "./ModerationQueues";
import { setCacheHintWhenTruthy } from "./util";

export const Query: Required<GQLQueryTypeResolver<void>> = {
  story: (source, args, ctx) => ctx.loaders.Stories.find.load(args),
  stream: (source, args, ctx) =>
    ctx.tenant.stories.disableLazy
      ? ctx.loaders.Stories.find.load(args)
      : ctx.loaders.Stories.findOrCreate.load(args),
  stories: (source, args, ctx) => ctx.loaders.Stories.connection(args),
  user: (source, args, ctx) => ctx.loaders.Users.user.load(args.id),
  users: (source, args, ctx) => ctx.loaders.Users.connection(args),
  comment: (source, { id }, ctx) =>
    id ? ctx.loaders.Comments.visible.load(id) : null,
  comments: (source, args, ctx) => ctx.loaders.Comments.forFilter(args),
  settings: (source, args, ctx) => ctx.tenant,
  viewer: (source, args, ctx, info) => setCacheHintWhenTruthy(ctx.user, info),
  discoverOIDCConfiguration: (source, { issuer }, ctx) =>
    ctx.loaders.Auth.discoverOIDCConfiguration.load(issuer),
  debugScrapeStoryMetadata: (source, { url }, ctx) =>
    ctx.loaders.Stories.debugScrapeMetadata.load(url),
  moderationQueues: moderationQueuesResolver,
  sections: (source, args, ctx) => ctx.loaders.Stories.sections(),
  activeStories: (source, { limit = 10 }, ctx) =>
    ctx.loaders.Stories.activeStories(limit),
  sites: (source, args, ctx) => ctx.loaders.Sites.connection(args),
  site: (source, { id }, ctx) => (id ? ctx.loaders.Sites.site.load(id) : null),
  webhookEndpoint: (source, { id }, ctx) => getWebhookEndpoint(ctx.tenant, id),
  queues: () => ({}),
  externalModerationPhase: (source, { id }, ctx) =>
    ctx.tenant.integrations.external
      ? getExternalModerationPhase(ctx.tenant.integrations.external, id)
      : null,
  emailDomain: (source, { id }, ctx) =>
    ctx.tenant.emailDomainModeration
      ? getEmailDomain(ctx.tenant.emailDomainModeration, id)
      : null,
  flags: (source, { first, after, orderBy, storyID, siteID, section }, ctx) =>
    ctx.loaders.CommentActions.forFilter({
      first: defaultTo(first, 10),
      after,
      storyID,
      siteID,
      section,
      orderBy: defaultTo(orderBy, GQLCOMMENT_SORT.CREATED_AT_DESC),
      filter: {
        actionType: ACTION_TYPE.FLAG,
        reason: {
          $in: [
            GQLCOMMENT_FLAG_REPORTED_REASON.COMMENT_REPORTED_ABUSIVE,
            GQLCOMMENT_FLAG_REPORTED_REASON.COMMENT_REPORTED_BIO,
            GQLCOMMENT_FLAG_REPORTED_REASON.COMMENT_REPORTED_OFFENSIVE,
            GQLCOMMENT_FLAG_REPORTED_REASON.COMMENT_REPORTED_OTHER,
            GQLCOMMENT_FLAG_REPORTED_REASON.COMMENT_REPORTED_SPAM,
          ],
        },
      },
    }),
};
