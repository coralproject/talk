import { GQLUserTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import * as user from "talk-server/models/user";

export const User: GQLUserTypeResolver<user.User> = {
  comments: (u, input, ctx) => ctx.loaders.Comments.forUser(u.id, input),
};
