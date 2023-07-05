import * as user from "coral-server/models/user";

import { GQLBanStatusHistoryTypeResolver } from "coral-server/graph/schema/__generated__/types";

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
  sites: ({ siteIDs }, input, ctx) =>
    siteIDs && siteIDs.length > 0
      ? ctx.loaders.Sites.site.loadMany(siteIDs)
      : [],
};
