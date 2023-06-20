import * as user from "coral-server/models/user";

import { GQLPremodStatusHistoryResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export const PremodStatusHistory: RequiredResolver<
  GQLPremodStatusHistoryResolvers<GraphContext, user.PremodStatusHistory>
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
