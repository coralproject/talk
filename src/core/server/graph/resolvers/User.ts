import { GraphQLResolveInfo } from "graphql";

import GraphContext from "coral-server/graph/context";
import {
  GQLUser,
  GQLUserTypeResolver,
} from "coral-server/graph/schema/__generated__/types";
import * as user from "coral-server/models/user";
import { roleIsStaff } from "coral-server/models/user/helpers";

import { RecentCommentHistoryInput } from "./RecentCommentHistory";
import { UserStatusInput } from "./UserStatus";
import { getRequestedFields } from "./util";

const maybeLoadOnlyIgnoredUserID = (
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
  return Promise.all(users.map(({ id }) => ctx.loaders.Users.user.load(id)));
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
  ignoredUsers: ({ ignoredUsers }, input, ctx, info) =>
    maybeLoadOnlyIgnoredUserID(ctx, info, ignoredUsers),
  ignoreable: ({ role }) => !roleIsStaff(role),
  recentCommentHistory: ({ id }): RecentCommentHistoryInput => ({ userID: id }),
  profiles: ({ profiles }) => (profiles ? profiles : []),
};
