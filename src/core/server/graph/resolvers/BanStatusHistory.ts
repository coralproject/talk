import { GQLBanStatusHistoryTypeResolver } from "coral-server/graph/schema/__generated__/types";
import * as user from "coral-server/models/user";

export const BanStatusHistory: Required<
  GQLBanStatusHistoryTypeResolver<user.BanStatusHistory>
> = {
  active: ({ active }) => active,
  createdBy: ({ createdBy }, input, ctx) => {
    if (createdBy) {
      return ctx.loaders.Users.user.load(createdBy);
    }

    return null;
  },
  createdAt: ({ createdAt }) => createdAt,
  message: ({ message }) => message,
};
