import * as user from "coral-server/models/user";

import { GQLModMessageStatusHistoryTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const ModMessageStatusHistory: Required<
  GQLModMessageStatusHistoryTypeResolver<user.ModMessageStatusHistory>
> = {
  active: ({ active }) => active,
  acknowledgedAt: ({ acknowledgedAt }) => acknowledgedAt,
  createdBy: ({ createdBy }, input, ctx) => {
    return ctx.loaders.Users.user.load(createdBy);
  },
  createdAt: ({ createdAt }) => createdAt,
  message: ({ message }) => message,
};
