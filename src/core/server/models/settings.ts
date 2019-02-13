import { Omit } from "talk-common/types";
import {
  GQLAuthDisplayNameConfiguration,
  GQLCharCount,
  GQLDisableCommenting,
  GQLEmail,
  GQLExternalIntegrations,
  GQLFacebookAuthIntegration,
  GQLGoogleAuthIntegration,
  GQLKarma,
  GQLLocalAuthIntegration,
  GQLMODERATION_MODE,
  GQLOIDCAuthIntegration,
  GQLReactionConfiguration,
  GQLSSOAuthIntegration,
  GQLWordList,
} from "talk-server/graph/tenant/schema/__generated__/types";

export interface ModerationSettings {
  moderation: GQLMODERATION_MODE;
  requireEmailConfirmation: boolean;
  communityGuidelines: {
    enabled: boolean;
    content?: string;
  };
  questionBoxEnable: boolean;
  questionBoxIcon?: string;
  questionBoxContent?: string;
  premodLinksEnable: boolean;
  autoCloseStream: boolean;

  /**
   * closedTimeout is the amount of seconds from the createdAt timestamp that a
   * given story will be considered closed.
   */
  closedTimeout: number;
  closedMessage?: string;
  disableCommenting: GQLDisableCommenting;
  charCount: GQLCharCount;
}

export type LocalAuthIntegration = GQLLocalAuthIntegration;
export type SSOAuthIntegration = GQLSSOAuthIntegration;

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

export interface AuthIntegrations {
  local: LocalAuthIntegration;
  sso: SSOAuthIntegration;
  oidc: OIDCAuthIntegration;
  google: GoogleAuthIntegration;
  facebook: FacebookAuthIntegration;
}

export interface Auth {
  /**
   * integrations are the set of configurations for the variations of
   * authentication solutions.
   */
  integrations: AuthIntegrations;

  /**
   * displayName contains configuration related to the use of Display Names
   * across AuthIntegrations.
   */
  displayName: GQLAuthDisplayNameConfiguration;
}

export interface Settings extends ModerationSettings {
  /**
   * customCSSURL is the URL that can be specified by the Tenant to describe a
   * URL that contains custom styles to be applied to the Stream.
   */
  customCSSURL?: string;

  /**
   * editCommentWindowLength is the length of time (in seconds) after a comment
   * is posted that it can still be edited by the author.
   */
  editCommentWindowLength: number;

  /**
   * email is the set of credentials and settings associated with the
   * Tenant.
   */
  email: GQLEmail;

  /**
   * karma is the set of settings related to how user Trust and Karma are
   * handled.
   */
  karma: GQLKarma;

  /**
   * wordList stores all the banned/suspect words.
   */
  wordList: GQLWordList;

  /**
   * Set of configured authentication integrations.
   */
  auth: Auth;

  /**
   * Various integrations with external services.
   */
  integrations: GQLExternalIntegrations;

  /**
   * reaction specifies the configuration for reactions.
   */
  reaction: GQLReactionConfiguration;
}
