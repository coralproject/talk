import * as user from "coral-server/models/user";

import { GQLBanStatusHistoryResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export const BanStatusHistory: RequiredResolver<
  GQLBanStatusHistoryResolvers<GraphContext, user.BanStatusHistory>
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
