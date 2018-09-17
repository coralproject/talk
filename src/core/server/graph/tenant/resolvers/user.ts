import { GQLUserTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { User } from "talk-server/models/user";

const User: GQLUserTypeResolver<User> = {
  comments: (user, input, ctx) => ctx.loaders.Comments.forUser(user.id, input),
};

export default User;
