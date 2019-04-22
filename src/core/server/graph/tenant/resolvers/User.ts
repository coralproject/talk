import { GQLUserTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import * as user from "talk-server/models/user";

import { UserStatusInput } from "./UserStatus";

export const User: GQLUserTypeResolver<user.User> = {
  comments: ({ id }, input, ctx) => ctx.loaders.Comments.forUser(id, input),
  commentModerationActionHistory: ({ id }, input, ctx) =>
    ctx.loaders.CommentModerationActions.forModerator(input, id),
  status: ({ id, status }): UserStatusInput => ({
    ...status,
    userID: id,
  }),
};
