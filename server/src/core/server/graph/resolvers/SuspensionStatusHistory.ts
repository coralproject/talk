import * as user from "coral-server/models/user";

import { GQLSuspensionStatusHistoryTypeResolver } from "coral-server/graph/schema/__generated__/types";

export const SuspensionStatusHistory: Required<
  GQLSuspensionStatusHistoryTypeResolver<user.SuspensionStatusHistory>
> = {
  active: ({ from }, input, ctx) =>
    from.start <= ctx.now && from.finish > ctx.now,
  from: ({ from }) => from,
  createdBy: ({ createdBy }, input, ctx) => {
    if (createdBy) {
      return ctx.loaders.Users.user.load(createdBy);
    }

    return null;
  },
  createdAt: ({ createdAt }) => createdAt,
  modifiedBy: ({ modifiedBy }, input, ctx) => {
    if (modifiedBy) {
      return ctx.loaders.Users.user.load(modifiedBy);
    }

    return null;
  },
  modifiedAt: ({ modifiedAt }) => modifiedAt,
  message: ({ message }) => message,
};
