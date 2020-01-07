import { GQLPremodStatusHistoryTypeResolver } from "coral-server/graph/schema/__generated__/types";
import * as user from "coral-server/models/user";

export const PremodStatusHistory: Required<
  GQLPremodStatusHistoryTypeResolver<user.PremodStatusHistory>
> = {
  active: ({ active }) => active,
  createdBy: ({ createdBy }, input, ctx) => {
    if (createdBy) {
      return ctx.loaders.Users.user.load(createdBy);
    }

    return null;
  },
  createdAt: ({ createdAt }) => createdAt,
};
