import { GQLBanStatusHistoryTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import * as user from "talk-server/models/user";

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
};
