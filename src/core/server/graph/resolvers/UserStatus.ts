import * as user from "coral-server/models/user";

import {
  GQLSite,
  GQLUSER_STATUS,
  GQLUserStatusTypeResolver,
} from "coral-server/graph/schema/__generated__/types";
import { BanStatus } from "coral-server/models/user";

import GraphContext from "../context";
import { BanStatusInput } from "./BanStatus";
import { PremodStatusInput } from "./PremodStatus";
import { SuspensionStatusInput } from "./SuspensionStatus";
import { UsernameStatusInput } from "./UsernameStatus";
import { WarningStatusInput } from "./WarningStatus";

export type UserStatusInput = user.UserStatus & {
  userID: string;
};

const banActive = (ban: BanStatus, ctx: GraphContext) => {
  if (ban.active) {
    return true;
  }

  const siteID = ctx?.site?.id;
  if (!siteID) {
    return false;
  }

  return !!ban.siteIDs?.includes(siteID);
};

const banStatusSites = async (
  ban: BanStatus,
  ctx: GraphContext
): Promise<GQLSite[]> => {
  if (!ban.siteIDs) {
    return [];
  }

  const sites = await ctx.loaders.Sites.site.loadMany(ban.siteIDs);

  const returnedSites = new Array<GQLSite>();
  sites.forEach((s) => {
    if (!s) {
      return;
    }

    returnedSites.push({
      ...s,
      canModerate: false,
      topStories: [],
    });
  });

  return returnedSites;
};

export const UserStatus: Required<GQLUserStatusTypeResolver<
  UserStatusInput
>> = {
  current: (status, input, ctx) => {
    const consolidatedStatus = user.consolidateUserStatus(status, ctx.now);
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
    ...user.consolidateUserBanStatus(ban),
    active: banActive(ban, ctx),
    sites: await banStatusSites(ban, ctx),
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
};
