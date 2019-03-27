import { GQLSuspensionStatusHistoryTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import * as user from "talk-server/models/user";

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
};
