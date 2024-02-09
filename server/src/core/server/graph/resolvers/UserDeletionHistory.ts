import * as user from "coral-server/models/user";

import { GQLUserDeletionHistoryTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const UserDeletionHistory: Required<
  GQLUserDeletionHistoryTypeResolver<user.UserDeletionHistory>
> = {
  createdBy: ({ createdBy }, input, ctx) => {
    if (createdBy) {
      return ctx.loaders.Users.user.load(createdBy);
    }

    return null;
  },
  createdAt: ({ createdAt }) => createdAt,
  updateType: ({ updateType }) => updateType,
};
