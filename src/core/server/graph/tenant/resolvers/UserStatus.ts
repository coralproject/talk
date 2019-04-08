import {
  GQLUSER_STATUS,
  GQLUserStatusTypeResolver,
} from "talk-server/graph/tenant/schema/__generated__/types";
import * as user from "talk-server/models/user";

import { BannedStatusInput } from "./BannedStatus";
import { SuspensionStatusInput } from "./SuspensionStatus";

export type UserStatusInput = user.UserStatus & {
  userID: string;
};

export const UserStatus: Required<
  GQLUserStatusTypeResolver<UserStatusInput>
> = {
  current: (status, input, ctx) => {
    const consolidatedStatus = user.consolidateUserStatus(status, ctx.now);
    const statuses: GQLUSER_STATUS[] = [];

    // If they are currently banned, then mark it.
    if (consolidatedStatus.banned.active) {
      statuses.push(GQLUSER_STATUS.BANNED);
    }

    // If they are currently suspended, then mark it.
    if (consolidatedStatus.suspension.active) {
      statuses.push(GQLUSER_STATUS.SUSPENDED);
    }

    // If no other statuses were applied, then apply the active status.
    if (statuses.length === 0) {
      statuses.push(GQLUSER_STATUS.ACTIVE);
    }

    return statuses;
  },
  banned: ({ banned, userID }): BannedStatusInput => ({
    ...user.consolidateUserBannedStatus(banned),
    userID,
  }),
  suspension: ({ suspension, userID }): SuspensionStatusInput => ({
    ...user.consolidateUserSuspensionStatus(suspension),
    userID,
  }),
};
