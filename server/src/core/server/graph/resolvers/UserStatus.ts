import * as user from "coral-server/models/user";

import {
  GQLUSER_STATUS,
  GQLUserStatusTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

import { BanStatusInput } from "./BanStatus";
import { ModMessageStatusInput } from "./ModMessageStatus";
import { PremodStatusInput } from "./PremodStatus";
import { SuspensionStatusInput } from "./SuspensionStatus";
import { UsernameStatusInput } from "./UsernameStatus";
import { WarningStatusInput } from "./WarningStatus";

export type UserStatusInput = user.UserStatus & {
  userID: string;
};

export const UserStatus: Required<GQLUserStatusTypeResolver<UserStatusInput>> =
  {
    current: (status, input, ctx) => {
      const consolidatedStatus = user.consolidateUserStatus(
        status,
        ctx.now,
        ctx.site?.id
      );
      const statuses: GQLUSER_STATUS[] = [];

      // If they are currently banned, then mark it.
      if (consolidatedStatus.ban.active) {
        statuses.push(GQLUSER_STATUS.BANNED);
      }

      // If they are currently suspended, then mark it.
      if (consolidatedStatus.suspension.active) {
        statuses.push(GQLUSER_STATUS.SUSPENDED);
      }

      // If they are set to mandatory premod, then mark it.
      if (consolidatedStatus.premod.active) {
        statuses.push(GQLUSER_STATUS.PREMOD);
      }

      // If they have a warning, then mark it.
      if (consolidatedStatus.warning.active) {
        statuses.push(GQLUSER_STATUS.WARNED);
      }

      // If no other statuses were applied, then apply the active status.
      if (statuses.length === 0) {
        statuses.push(GQLUSER_STATUS.ACTIVE);
      }

      return statuses;
    },
    username: ({ userID, username }): UsernameStatusInput => ({
      ...user.consolidateUsernameStatus(username),
      userID,
    }),
    ban: async ({ ban, userID }, args, ctx): Promise<BanStatusInput> => ({
      ...user.consolidateUserBanStatus(ban, ctx.site?.id),
      userID,
    }),
    suspension: ({ suspension, userID }): SuspensionStatusInput => ({
      ...user.consolidateUserSuspensionStatus(suspension),
      userID,
    }),
    premod: ({ premod, userID }): PremodStatusInput => ({
      ...user.consolidateUserPremodStatus(premod),
      userID,
    }),
    warning: ({ warning, userID }): WarningStatusInput => ({
      ...user.consolidateUserWarningStatus(warning),
      userID,
    }),
    modMessage: ({ modMessage, userID }): ModMessageStatusInput => ({
      ...user.consolidateUserModMessageStatus(modMessage),
      userID,
    }),
  };
