import { GraphQLResolveInfo } from "graphql";

import GraphContext from "coral-server/graph/context";
import * as user from "coral-server/models/user";
import { roleIsStaff } from "coral-server/models/user/helpers";

import {
  GQLUser,
  GQLUSER_ROLE,
  GQLUserTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

import { RecentCommentHistoryInput } from "./RecentCommentHistory";
import { UserStatusInput } from "./UserStatus";
import { getRequestedFields } from "./util";

const maybeLoadOnlyExistingIgnoredUsers = async (
  ctx: GraphContext,
  info: GraphQLResolveInfo,
  users?: user.IgnoredUser[]
) => {
  // If there isn't any ids, then return nothing!
  if (!users || users.length <= 0) {
    return [];
  }

  // Get the field names of the fields being requested, if it's only the ID,
  // we have that, so no need to make a database request.
  const fields = getRequestedFields<GQLUser>(info);
  if (fields.length === 1 && fields[0] === "id") {
    return users.map(({ id }) => ({ id }));
  }

  // We want more than the ID! Get the user!
  const ignoredUserResults = await ctx.loaders.Users.user.loadMany(
    users.map((u) => u.id)
  );

  const existingIgnoredUsers = ignoredUserResults.filter(
    (res): res is user.User => res !== null && !(res instanceof Error)
  );

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
    // Moderation scopes only apply to users that have the moderator role.
    if (role !== GQLUSER_ROLE.MODERATOR) {
      return null;
    }

    // For all other users return null for moderation scopes.
    return moderationScopes;
  },
  membershipScopes: ({ role, membershipScopes }, input, ctx) => {
    if (role !== GQLUSER_ROLE.MEMBER) {
      return null;
    }

    return membershipScopes;
  },
  ignoredUsers: ({ ignoredUsers }, input, ctx, info) =>
    maybeLoadOnlyExistingIgnoredUsers(ctx, info, ignoredUsers),
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
  inPageNotifications: ({ inPageNotifications }) => {
    return inPageNotifications
      ? inPageNotifications
      : user.defaultInPageNotificationSettings;
  },
  mediaSettings: ({ mediaSettings = {} }) => mediaSettings,
  hasNewNotifications: ({ lastSeenNotificationDate }, input, ctx) => {
    if (!ctx.user) {
      return false;
    }

    return ctx.loaders.Notifications.hasNewNotifications(
      ctx.user.id,
      ctx.user.lastSeenNotificationDate ?? new Date(0)
    );
  },
  lastSeenNotificationDate: ({ lastSeenNotificationDate }) => {
    return lastSeenNotificationDate ?? new Date(0);
  },
  featuredCommenter: ({ lastFeaturedDate }) => {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    return lastFeaturedDate && lastFeaturedDate >= tenDaysAgo;
  },
  newCommenter: ({ createdAt }) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return createdAt >= sevenDaysAgo;
  },
  badges: ({ badges, secretBadges }) => {
    if (!badges && !secretBadges) {
      return undefined;
    }

    let result: string[] = [];
    if (badges) {
      result = [...result, ...badges];
    }
    if (secretBadges) {
      result = [...result, ...secretBadges];
    }

    return result;
  },
  commentCounts: ({ commentCounts }) => {
    return { statuses: commentCounts.status };
  },
};
