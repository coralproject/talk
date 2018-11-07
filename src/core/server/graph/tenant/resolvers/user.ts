import { GQLUserTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import * as user from "talk-server/models/user";

export const User: GQLUserTypeResolver<user.User> = {
  comments: ({ id }, input, ctx) => ctx.loaders.Comments.forUser(id, input),
  commentModerationActionHistory: ({ id }, input, ctx) =>
    ctx.loaders.Actions.commentModerationActionsConnection(input, id),
};
