import { GQLUserStatusTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import * as user from "talk-server/models/user";

import { BannedStatusInput } from "./BannedStatus";
import { SuspensionStatusInput } from "./SuspensionStatus";

export type UserStatusInput = user.UserStatus & {
  userID: string;
};

export const UserStatus: Required<
  GQLUserStatusTypeResolver<UserStatusInput>
> = {
  banned: ({ banned, userID }): BannedStatusInput => ({
    ...user.consolidateUserBannedStatus(banned),
    userID,
  }),
  suspension: ({ suspension, userID }): SuspensionStatusInput => ({
    ...user.consolidateUserSuspensionStatus(suspension),
    userID,
  }),
};
