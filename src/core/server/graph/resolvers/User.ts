import { GraphQLResolveInfo } from "graphql";

import GraphContext from "coral-server/graph/context";
import { hasFeatureFlag } from "coral-server/models/tenant";
import * as user from "coral-server/models/user";
import { roleIsStaff } from "coral-server/models/user/helpers";

import {
  GQLFEATURE_FLAG,
  GQLUSER_ROLE,
  GQLUserTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

import { RecentCommentHistoryInput } from "./RecentCommentHistory";
import { UserStatusInput } from "./UserStatus";

const maybeLoadOnlyIgnoredUserID = async (
  ctx: GraphContext,
  info: GraphQLResolveInfo,
  users?: user.IgnoredUser[]
) => {
  // If there isn't any ids, then return nothing!
  if (!users || users.length <= 0) {
    return [];
  }

  const ignoredUserResults = await ctx.loaders.Users.user.loadMany(
    users.map((u) => u.id)
  );

  const existingIgnoredUsers = ignoredUserResults.filter(
    (res): res is user.User => res !== null && !(res instanceof Error)
  );
  // We want more than the ID! Get the user!
  return existingIgnoredUsers;
};

export const User: GQLUserTypeResolver<user.User> = {
  comments: ({ id }, input, ctx) => ctx.loaders.Comments.forUser(id, input),
  allComments: ({ id }, input, ctx) =>
    ctx.loaders.Comments.forUserAll(id, input),
  rejectedComments: ({ id }, input, ctx) =>
    ctx.loaders.Comments.forUserRejected(id, input),
  commentModerationActionHistory: ({ id }, input, ctx) =>
    ctx.loaders.CommentModerationActions.forModerator(input, id),
  status: ({ id, status }): UserStatusInput => ({
    ...status,
    userID: id,
  }),
  moderationScopes: ({ role, moderationScopes }, input, ctx) => {
    // If the feature flag for site moderators is not turned on return null
    // always.
    if (!hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.SITE_MODERATOR)) {
      return null;
    }

    // Moderation scopes only apply to users that have the moderator role.
    if (role !== GQLUSER_ROLE.MODERATOR) {
      return null;
    }

    // For all other users return null for moderation scopes.
    return moderationScopes;
  },
  ignoredUsers: ({ ignoredUsers }, input, ctx, info) =>
    maybeLoadOnlyIgnoredUserID(ctx, info, ignoredUsers),
  ignoreable: ({ role }) => !roleIsStaff(role),
  recentCommentHistory: ({ id }): RecentCommentHistoryInput => ({ userID: id }),
  profiles: ({ profiles = [] }) => profiles,
  ongoingDiscussions: async ({ id }, input, ctx) => {
    // Get the ongoing discussions from the loader.
    const results = await ctx.loaders.Stories.ongoingDiscussions(id, input);

    // If there isn't any ids, then return nothing!
    if (results.length === 0) {
      return [];
    }

    // Get the Stories!
    return ctx.loaders.Stories.story.loadMany(results.map(({ _id }) => _id));
  },
  mediaSettings: ({ mediaSettings = {} }) => mediaSettings,
};
