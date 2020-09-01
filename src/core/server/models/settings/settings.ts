import {
  GQLAkismetExternalIntegration,
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

export interface ExternalIntegrations {
  /**
   * akismet provides integration with the Akismet Spam detection service.
   */
  akismet: GQLAkismetExternalIntegration;

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

export type Settings = GlobalModerationSettings &
  Pick<
    GQLSettings,
    | "charCount"
    | "email"
    | "recentCommentHistory"
    | "wordList"
    | "reaction"
    | "staff"
    | "editCommentWindowLength"
    | "customCSSURL"
    | "communityGuidelines"
    | "stories"
    | "createdAt"
    | "slack"
    | "announcement"
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
     * rte stores configuration for the rich text editor.
     */
    rte?: RTEConfiguration;

    /**
     * media is the configuration media content attached to Comment's.
     */
    media?: Omit<GQLMediaConfiguration, "external">;
  };

export const defaultRTEConfiguration: RTEConfiguration = {
  enabled: true,
  spoiler: false,
  strikethrough: false,
};
