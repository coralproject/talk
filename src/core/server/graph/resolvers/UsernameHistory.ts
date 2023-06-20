import * as user from "coral-server/models/user";

import { GQLUsernameHistoryResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export const UsernameHistory: RequiredResolver<
  GQLUsernameHistoryResolvers<GraphContext, user.UsernameHistory>
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
