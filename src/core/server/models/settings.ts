import { Omit } from "coral-common/types";

import {
  GQLAuth,
  GQLAuthenticationTargetFilter,
  GQLCommenterAccountFeatures,
  GQLEmailConfiguration,
  GQLCommunityGuidelines,
  GQLEntitySettings,
  GQLExternalIntegrations,
  GQLFacebookAuthIntegration,
  GQLGoogleAuthIntegration,
  GQLLiveConfiguration,
  GQLLocalAuthIntegration,
  GQLOIDCAuthIntegration,
  GQLRecentCommentHistoryConfiguration,
  GQLSettings,
  GQLSSOAuthIntegration,
  GQLStoryConfiguration,
  GQLStoryScrapingConfiguration,
  GQLWordList,
} from "coral-server/graph/tenant/schema/__generated__/types";

export type LiveConfiguration = Omit<GQLLiveConfiguration, "configurable">;

export type CloseCommenting = Omit<
  GQLEntitySettings["closeCommenting"],
  "message"
> &
  Partial<Pick<GQLEntitySettings["closeCommenting"], "message">>;

export type DisableCommenting = Omit<
  GQLEntitySettings["disableCommenting"],
  "message"
> &
  Partial<Pick<GQLEntitySettings["disableCommenting"], "message">>;

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

export type Auth = Omit<GQLAuth, "integrations"> & {
  integrations: AuthIntegrations;
};

export type PartialAuth = Omit<GQLAuth, "integrations"> & {
  integrations: Partial<AuthIntegrations>;
};

export type PartialStoryConfiguration = Partial<
  Omit<GQLStoryConfiguration, "scraping">
> & {
  scraping: Partial<GQLStoryScrapingConfiguration>;
};

export type Settings = Pick<
  GQLEntitySettings,
  | "accountFeatures"
  | "charCount"
  | "communityGuidelines"
  | "customCSSURL"
  | "editCommentWindowLength"
  | "email"
  | "integrations"
  | "moderation"
  | "premodLinksEnable"
  | "reaction"
  | "recentCommentHistory"
  | "staff"
  | "staticURI"
  | "stories"
  | "wordList"
> & {
  closeCommenting: CloseCommenting;
  disableCommenting: DisableCommenting;
  live: LiveConfiguration;
};

export type PartialSettings = Partial<
  Pick<
    GQLEntitySettings,
    | "customCSSURL"
    | "editCommentWindowLength"
    | "email"
    | "moderation"
    | "premodLinksEnable"
    | "reaction"
    | "staff"
    | "staticURI"
  >
> & {
  accountFeatures?: Partial<GQLCommenterAccountFeatures>;
  communityGuidelines?: Partial<GQLCommunityGuidelines>;
  integrations?: Partial<GQLExternalIntegrations>;
  live?: Partial<LiveConfiguration>;
  recentCommentHistory?: Partial<GQLRecentCommentHistoryConfiguration>;
  stories?: PartialStoryConfiguration;
  wordList?: Partial<GQLWordList>;
};
