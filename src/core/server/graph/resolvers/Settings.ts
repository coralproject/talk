import { defaultRTEConfiguration } from "coral-server/models/settings";
import validFeatureFlagsFilter from "coral-server/models/settings/validFeatureFlagsFilter";
import {
  retrieveAnnouncementIfEnabled,
  Tenant,
} from "coral-server/models/tenant";

import {
  GQLSettingsTypeResolver,
  GQLWEBHOOK_EVENT_NAME,
} from "coral-server/graph/schema/__generated__/types";

import { LiveConfigurationInput } from "./LiveConfiguration";

export const Settings: GQLSettingsTypeResolver<Tenant> = {
  slack: ({ slack = {} }) => slack,
  featureFlags: ({ featureFlags = [] }, args, ctx) =>
    featureFlags.filter(validFeatureFlagsFilter(ctx.user)),
  announcement: ({ announcement }) =>
    retrieveAnnouncementIfEnabled(announcement),
  multisite: async ({ id }, input, ctx) => {
    const sites = await ctx.loaders.Sites.connection({});
    return sites.edges.length > 1;
  },
  webhookEvents: () => Object.values(GQLWEBHOOK_EVENT_NAME),
  rte: ({ rte = defaultRTEConfiguration }) => rte,
  media: ({ media = {} }) => media,
  live: ({ live }): LiveConfigurationInput => live,
  memberBios: ({ memberBios = false }) => memberBios,
  premoderateSuspectWords: ({ premoderateSuspectWords = false }) =>
    premoderateSuspectWords,
  stories: ({ stories }) => stories,
};
