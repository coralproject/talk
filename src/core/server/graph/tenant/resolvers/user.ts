import { GQLUserTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { User } from "talk-server/models/User";

const User: GQLUserTypeResolver<User> = {
  comments: (asset, input, ctx) =>
    ctx.user ? ctx.loaders.Comments.forUser(ctx.user.id, input) : [],
};

export default User;
