import { GQLUsernameHistoryTypeResolver } from "coral-server/graph/schema/__generated__/types";
import * as user from "coral-server/models/user";

export const UsernameHistory: Required<
  GQLUsernameHistoryTypeResolver<user.UsernameHistory>
> = {
  createdBy: ({ createdBy }, input, ctx) => {
    if (createdBy) {
      return ctx.loaders.Users.user.load(createdBy);
    }

    return null;
  },
  createdAt: ({ createdAt }) => createdAt,
  username: ({ username }) => username,
};
