import { GQLUserTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { User, verifyUserRegistrationCompleted } from "talk-server/models/user";

const User: GQLUserTypeResolver<User> = {
  comments: (user, input, ctx) => ctx.loaders.Comments.forUser(user.id, input),
  registrationCompleted: verifyUserRegistrationCompleted,
};

export default User;
