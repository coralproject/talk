import {
  GQLAuth,
  GQLAuthenticationTargetFilter,
  GQLCOMMENT_BODY_FORMAT,
  GQLEmailConfiguration,
  GQLFacebookAuthIntegration,
  GQLGoogleAuthIntegration,
  GQLLiveConfiguration,
  GQLLocalAuthIntegration,
  GQLMediaConfiguration,
  GQLMODERATION_MODE,
  GQLOIDCAuthIntegration,
  GQLPerspectiveExternalIntegration,
  GQLSettings,
} from "coral-server/graph/schema/__generated__/types";

import { SigningSecretResource } from "./signingSecret";

export type LiveConfiguration = Omit<GQLLiveConfiguration, "configurable">;

export type EmailConfiguration = GQLEmailConfiguration;

export interface GlobalModerationSettings {
  live: LiveConfiguration;
  moderation: GQLMODERATION_MODE;
  premodLinksEnable: boolean;
  premoderateAllCommentsSites: string[];
  emailDomainModeration: EmailDomain[];
}

export type OIDCAuthIntegration = Omit<
  GQLOIDCAuthIntegration,
  "callbackURL" | "redirectURL"
>;

export type GoogleAuthIntegration = Omit<
  GQLGoogleAuthIntegration,
  "callbackURL" | "redirectURL"
>;

export type FacebookAuthIntegration = Omit<
  GQLFacebookAuthIntegration,
  "callbackURL" | "redirectURL"
>;

export interface SSOAuthIntegration extends SigningSecretResource {
  enabled: boolean;
  allowRegistration: boolean;
  targetFilter: GQLAuthenticationTargetFilter;
}

/**
 * AuthIntegrations are the set of configurations for the variations of
 * authentication solutions.
 */
export interface AuthIntegrations {
  local: GQLLocalAuthIntegration;
  sso: SSOAuthIntegration;
  oidc: OIDCAuthIntegration;
  google: GoogleAuthIntegration;
  facebook: FacebookAuthIntegration;
}

/**
 * AccountFeatures are features enabled for commenter accounts
 */
export interface AccountFeatures {
  changeUsername: boolean;
  deleteAccount: boolean;
  downloadComments: boolean;
}

/**
 * NewCommentersConfiguration is the configuration for how new commenters comments are treated.
 */
export interface NewCommentersConfiguration {
  premodEnabled: boolean;
  approvedCommentsThreshold: number;
}

export interface BadgeConfiguration {
  staffLabel?: string;
  // MIGRATE: plan to migrate this to `staffLabel` in 7.0.0.
  label: string;
  adminLabel?: string;
  moderatorLabel?: string;
}

/**
 * Auth is the set of configured authentication integrations.
 */
export type Auth = Omit<GQLAuth, "integrations"> & {
  /**
   * integrations are the set of configurations for the variations of
   * authentication solutions.
   */
  integrations: AuthIntegrations;
};

export interface ExternalModerationPhase extends SigningSecretResource {
  /**
   * id identifies this particular External Moderation Phase.
   */
  id: string;

  /**
   * name is the name assigned to this ExternalModerationPhase for
   * identification purposes.
   */
  name: string;

  /**
   * enabled when true, will use this phase in the moderation pipeline.
   */
  enabled: boolean;

  /**
   * url is the actual URL that should be called.
   */
  url: string;

  /**
   * format is the format of the comment body sent.
   */
  format: GQLCOMMENT_BODY_FORMAT;

  /**
   * timeout is the number of milliseconds that this moderation is maximum
   * expected to take before it is skipped.
   */
  timeout: number;

  /**
   * createdAt is the date that this External Moderation Phase was created at.
   */
  createdAt: Date;
}

export interface ExternalModerationExternalIntegration {
  /**
   * phases is all the external moderation phases for this Tenant.
   */
  phases: ExternalModerationPhase[];
}

export interface AkismetExternalIntegration {
  /**
   * enabled when True will enable the integration.
   */
  enabled: boolean;

  /**
   * ipBased when true will enable IP-based spam detection.
   */
  ipBased?: boolean;

  /**
   * The key for the Akismet integration.
   */
  key?: string;

  /**
   * The site (blog) for the Akismet integration.
   */
  site?: string;
}

export interface ExternalIntegrations {
  /**
   * akismet provides integration with the Akismet Spam detection service.
   */
  akismet: AkismetExternalIntegration;

  /**
   * perspective provides integration with the Perspective API comment analysis
   * platform.
   */
  perspective: GQLPerspectiveExternalIntegration;

  /**
   * external provides integration details for external moderation phases that can be
   * used in the moderation pipeline.
   */
  external?: ExternalModerationExternalIntegration;
}

/**
 * CloseCommenting contains settings related to the automatic closing of commenting on
 * Stories.
 */
export type CloseCommenting = Omit<GQLSettings["closeCommenting"], "message"> &
  Partial<Pick<GQLSettings["closeCommenting"], "message">>;

/**
 * DisableCommenting will disable commenting site-wide.
 */
export type DisableCommenting = Omit<
  GQLSettings["disableCommenting"],
  "message"
> &
  Partial<Pick<GQLSettings["disableCommenting"], "message">>;

/**
 * RTEConfiguration stores configuration for the rich text editor.
 */
export interface RTEConfiguration {
  /**
   * enabled when true turns on basic RTE features including
   * bold, italic, quote, and bullet list.
   */
  enabled: boolean;

  /**
   * strikethrough when true turns on the strikethrough feature.
   */
  strikethrough: boolean;

  /**
   * spoiler when true turns on the spoiler feature.
   */
  spoiler: boolean;
}

/**
 * StoryScrapingConfiguration stores the configuration around story scraping.
 */
export interface StoryScrapingConfiguration {
  /**
   * enabled, when true, enables stories to be scraped. When disabled, stories will
   * only be looked up instead, and must be created via the API directly.
   */
  enabled: boolean;

  /**
   * proxyURL when specified, allows scraping requests to use the provided proxy.
   * All requests will then be passed through the appropriote proxy as parsed by
   * the [proxy-agent](https://www.npmjs.com/package/proxy-agent) package.
   */
  proxyURL?: string;

  /**
   * customUserAgent when specified will override the user agent used by fetch
   * requests made during the scraping process.
   */
  customUserAgent?: string;

  /**
   * authentication is whether alternative authentication credentials have been
   * provided for scraping activities.
   */
  authentication?: boolean;

  /**
   * username is the username to use with basic authentication for scraping jobs.
   */
  username?: string;

  /**
   * password is the password to use with basic authentication for scraping jobs.
   */
  password?: string;
}

/**
 * StoryConfiguration stores the configuration for working with stories.
 */
export interface StoryConfiguration {
  /**
   * scraping stores configuration around story scraping.
   */
  scraping: StoryScrapingConfiguration;

  /**
   * disableLazy when true, will only allow lookups of stories created via the API.
   */
  disableLazy: boolean;
}

export interface EmailDomain {
  id: string;
  domain: string;
  newUserModeration: "BAN" | "PREMOD";
}

export type Settings = GlobalModerationSettings &
  Pick<
    GQLSettings,
    | "charCount"
    | "email"
    | "recentCommentHistory"
    | "wordList"
    | "reaction"
    | "editCommentWindowLength"
    | "customCSSURL"
    | "communityGuidelines"
    | "createdAt"
    | "slack"
    | "announcement"
    | "memberBios"
  > & {
    /**
     * auth is the set of configured authentication integrations.
     */
    auth: Auth;

    /**
     * email is the set of credentials and settings associated with the
     * organization.
     */
    email: EmailConfiguration;

    /**
     * closeCommenting contains settings related to the automatic closing of commenting on
     * Stories.
     */
    closeCommenting: CloseCommenting;

    /**
     * disableCommenting will disable commenting site-wide.
     */
    disableCommenting: DisableCommenting;

    /**
     * AccountFeatures are features enabled for commenter accounts
     */
    accountFeatures: AccountFeatures;

    /**
     * integrations contains all the external integrations that can be enabled.
     */
    integrations: ExternalIntegrations;

    /**
     * newCommenters is the configuration for how new commenters comments are treated.
     */
    newCommenters: NewCommentersConfiguration;

    /**
     * premoderateSuspectWords when enabled will cause any comments that contain
     * suspect words to be sent to pre-moderation to be reviewed by a moderator prior
     * to being presented in stream.
     */
    premoderateSuspectWords?: boolean;

    /**
     * rte stores configuration for the rich text editor.
     */
    rte?: RTEConfiguration;

    /**
     * media is the configuration media content attached to Comment's.
     */
    media?: Omit<GQLMediaConfiguration, "external">;

    /**
     * staff configures the labels for staff members in comment stream.
     */
    badges: BadgeConfiguration;

    /**
     * stories stores the configuration around stories.
     */
    stories: StoryConfiguration;

    /**
     * amp activates Accelerated Mobile Pages support.
     */
    amp?: boolean;

    /**
     * flattenReplies is whether the tenant wants replies to be hidden behind
     * a "Show more of this conversation" link.
     */
    flattenReplies: boolean;

    /**
     * forReviewQueue is whether the tenant wants to enable the For Review
     * moderation queue in the admin to review every flag that has been
     * put on a comment by a user.
     */
    forReviewQueue?: boolean;
  };

export const defaultRTEConfiguration: RTEConfiguration = {
  enabled: true,
  spoiler: false,
  strikethrough: false,
};
