import { Omit } from "coral-common/types";

import {
  GQLAuth,
  GQLAuthenticationTargetFilter,
  GQLEmailConfiguration,
  GQLFacebookAuthIntegration,
  GQLGoogleAuthIntegration,
  GQLLiveConfiguration,
  GQLLocalAuthIntegration,
  GQLMODERATION_MODE,
  GQLOIDCAuthIntegration,
  GQLSettings,
} from "coral-server/graph/schema/__generated__/types";

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

export interface SSOKey {
  /**
   * kid is the identifier for the key used when verifying tokens issued by the
   * provider.
   */
  kid: string;

  /**
   * secret is the actual underlying secret used to verify the tokens with.
   */
  secret: string;

  /**
   * createdAt is the date that the key was created at.
   */
  createdAt: Date;

  /**
   * rotatedAt is the time that the token was rotated out.
   */
  rotatedAt?: Date;

  /**
   * inactiveAt is the date that the token can no longer be used to validate
   * tokens.
   */
  inactiveAt?: Date;
}

export interface SSOAuthIntegration {
  enabled: boolean;
  allowRegistration: boolean;
  targetFilter: GQLAuthenticationTargetFilter;
  keys: SSOKey[];
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

export type Settings = GlobalModerationSettings &
  Pick<
    GQLSettings,
    | "charCount"
    | "email"
    | "recentCommentHistory"
    | "wordList"
    | "integrations"
    | "reaction"
    | "staff"
    | "editCommentWindowLength"
    | "customCSSURL"
    | "communityGuidelines"
    | "stories"
    | "createdAt"
    | "slack"
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
     * newCommenters is the configuration for how new commenters comments are treated.
     */
    newCommenters: NewCommentersConfiguration;
  };
