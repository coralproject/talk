import { defaultRTEConfiguration } from "coral-server/models/settings";
import {
  retrieveAnnouncementIfEnabled,
  Tenant,
} from "coral-server/models/tenant";
import { hasModeratorRole } from "coral-server/models/user/helpers";

import {
  GQLFEATURE_FLAG,
  GQLSettingsTypeResolver,
  GQLWEBHOOK_EVENT_NAME,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

/**
 * FEATURE_FLAGS is an array of all the valid feature flags.
 */
const FEATURE_FLAGS = Object.values(GQLFEATURE_FLAG);

/**
 * PUBLIC_FEATURE_FLAGS are flags that are allowed to be returned when accessed
 * by a user with non-staff permissions.
 */
const PUBLIC_FEATURE_FLAGS = [
  GQLFEATURE_FLAG.DISCUSSIONS,
  GQLFEATURE_FLAG.READ_MORE_NEW_TAB,
];

type FlagFilter = (flag: GQLFEATURE_FLAG | string) => boolean;

const filterValidFeatureFlags = (ctx: GraphContext): FlagFilter => {
  const filters: FlagFilter[] = [
    // Return a type guard for the feature flag.
    (flag): flag is GQLFEATURE_FLAG =>
      FEATURE_FLAGS.includes(flag as GQLFEATURE_FLAG),
  ];

  // For anonomous users or users without a moderator role, ensure we only send
  // back the public flags.
  if (!ctx.user || !hasModeratorRole(ctx.user)) {
    filters.push((flag) =>
      PUBLIC_FEATURE_FLAGS.includes(flag as GQLFEATURE_FLAG)
    );
  }

  return (flag) => filters.every((filter) => filter(flag));
};

export const Settings: GQLSettingsTypeResolver<Tenant> = {
  slack: ({ slack = {} }) => slack,
  featureFlags: ({ featureFlags = [] }, args, ctx) =>
    featureFlags.filter(filterValidFeatureFlags(ctx)),
  announcement: ({ announcement }) =>
    retrieveAnnouncementIfEnabled(announcement),
  multisite: async ({ id }, input, ctx) => {
    const sites = await ctx.loaders.Sites.connection({});
    return sites.edges.length > 1;
  },
  webhookEvents: () => Object.values(GQLWEBHOOK_EVENT_NAME),
  rte: ({ rte = defaultRTEConfiguration }) => rte,
  media: ({ media = {} }) => media,
};
