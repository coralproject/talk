import { PROTECTED_EMAIL_DOMAINS } from "coral-common/common/lib/constants";
import {
  defaultDSAConfiguration,
  defaultRTEConfiguration,
} from "coral-server/models/settings";
import validFeatureFlagsFilter from "coral-server/models/settings/validFeatureFlagsFilter";
import {
  areRepliesFlattened,
  isAMPEnabled,
  isForReviewQueueEnabled,
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
  premoderateAllCommentsSites: ({ premoderateAllCommentsSites = [] }) =>
    premoderateAllCommentsSites,
  stories: ({ stories }) => stories,
  amp: (parent, args, ctx) => isAMPEnabled(ctx.tenant),
  flattenReplies: (parent, args, ctx) => areRepliesFlattened(ctx.tenant),
  forReviewQueue: (parent, args, ctx) => isForReviewQueueEnabled(ctx.tenant),
  disableDefaultFonts: ({ disableDefaultFonts }) =>
    Boolean(disableDefaultFonts),
  emailDomainModeration: ({ emailDomainModeration = [] }) =>
    emailDomainModeration,
  topCommenter: ({ topCommenter = { enabled: false } }) => topCommenter,
  newCommenter: ({ newCommenter = { enabled: false } }) => newCommenter,
  badges: ({ badges, staff }, args, ctx) => {
    const badgeConfig = badges || staff;

    return badgeConfig;
  },
  staff: ({ staff, badges }, args, ctx) => {
    // Default to new badges config if present
    const deprecated = badges || staff;

    return deprecated;
  },
  embeddedComments: (
    { embeddedComments = { allowReplies: true, oEmbedAllowedOrigins: [] } },
    args,
    ctx
  ) => {
    return {
      allowReplies: embeddedComments.allowReplies ?? true,
      oEmbedAllowedOrigins: embeddedComments.oEmbedAllowedOrigins ?? [],
    };
  },
  flairBadges: ({
    flairBadges = { flairBadgesEnabled: false, badges: [] },
  }) => {
    if (!flairBadges.badges) {
      return {
        flairBadgesEnabled: flairBadges.flairBadgesEnabled ?? false,
        badges: [],
      };
    }
    return flairBadges;
  },
  dsa: ({ dsa = defaultDSAConfiguration }) => dsa,
  protectedEmailDomains: ({
    protectedEmailDomains = Array.from(PROTECTED_EMAIL_DOMAINS),
  }) => protectedEmailDomains,
  disposableEmailDomains: ({ disposableEmailDomains = { enabled: false } }) =>
    disposableEmailDomains,
  inPageNotifications: ({
    inPageNotifications = { enabled: true, floatingBellIndicator: true },
  }) => inPageNotifications,
  showUnmoderatedCounts: ({ showUnmoderatedCounts = true }) =>
    showUnmoderatedCounts,
};
