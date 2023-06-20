import * as user from "coral-server/models/user";

import { GQLModMessageStatusHistoryResolvers } from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";
import RequiredResolver from "./RequireResolver";

export const ModMessageStatusHistory: RequiredResolver<
  GQLModMessageStatusHistoryResolvers<
    GraphContext,
    user.ModMessageStatusHistory
  >
> = {
  active: ({ active }) => active,
  acknowledgedAt: ({ acknowledgedAt }) => acknowledgedAt,
  createdBy: ({ createdBy }, input, ctx) => {
    return ctx.loaders.Users.user.load(createdBy);
  },
  createdAt: ({ createdAt }) => createdAt,
  message: ({ message }) => message,
};
