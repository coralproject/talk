import {
  retrieveAnnouncementIfEnabled,
  Tenant,
} from "coral-server/models/tenant";

import {
  GQLFEATURE_FLAG,
  GQLSettingsTypeResolver,
  GQLWEBHOOK_EVENT_NAME,
} from "coral-server/graph/schema/__generated__/types";

const filterValidFeatureFlags = () => {
  // Compute the valid flags based on this enum.
  const flags = Object.values(GQLFEATURE_FLAG);

  // Return a type guard for the feature flag.
  return (flag: string | GQLFEATURE_FLAG): flag is GQLFEATURE_FLAG =>
    flags.includes(flag as GQLFEATURE_FLAG);
};

export const Settings: GQLSettingsTypeResolver<Tenant> = {
  slack: ({ slack = {} }) => slack,
  featureFlags: ({ featureFlags = [] }) =>
    featureFlags.filter(filterValidFeatureFlags()),
  announcement: ({ announcement }) =>
    retrieveAnnouncementIfEnabled(announcement),
  multisite: async ({ id }, input, ctx) => {
    const sites = await ctx.loaders.Sites.connection({});
    return sites.edges.length > 1;
  },
  webhookEvents: () => Object.values(GQLWEBHOOK_EVENT_NAME),
};
