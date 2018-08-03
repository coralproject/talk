import {
  GQLMODERATION_MODE,
  GQLUSER_ROLE,
} from "talk-server/graph/tenant/schema/__generated__/types";

export interface Wordlist {
  banned: string[];
  suspect: string[];
}

export interface EmailDomainRuleCondition {
  /**
   * emailDomain is the domain name component of the email addresses that should
   * match for this condition.
   */
  emailDomain: string;
  /**
   * emailVerifiedRequired stipulates that this rule only applies when the user
   * account has been marked as having their email address already verified.
   */
  emailVerifiedRequired: boolean;
}

/**
 * RoleRule describes the role assignment for when a user logs into Talk, how
 * they can have their account automatically upgraded to a specific role when
 * the domain for their email matches the one provided.
 */
export interface RoleRule extends Partial<EmailDomainRuleCondition> {
  /**
   * role is the specific GQLUSER_ROLE that should be assigned to the newly
   * created user depending on their email address.
   */
  role: GQLUSER_ROLE;
}

export interface AuthRules {
  /**
   * roles allow the configuration of automatic role assignment based on the
   * user's email address.
   */
  roles?: RoleRule[];

  /**
   * restrictTo when populated, will restrict which users can login using this
   * integration. If a user successfully logs in using the OIDCStrategy, but
   * does not match the following rules, the user will not be created.
   */
  restrictTo?: EmailDomainRuleCondition[];
}

export interface AuthIntegration {
  enabled: boolean;
}

export interface DisplayNameAuthIntegration {
  displayNameEnable: boolean;
}

/**
 * SSOAuthIntegration is an AuthIntegration that provides a secret to the admins
 * of a tenant, where they can sign a SSO payload with it to provide to the
 * embed to allow single sign on.
 */
export interface SSOAuthIntegration
  extends AuthIntegration,
    DisplayNameAuthIntegration {
  key: string;
}

/**
 * OIDCAuthIntegration provides a way to store Open ID Connect credentials. This
 * will be used in the admin to provide staff logins for users.
 */
export interface OIDCAuthIntegration
  extends AuthIntegration,
    DisplayNameAuthIntegration {
  clientID: string;
  clientSecret: string;
  issuer: string;
  authorizationURL: string;
  jwksURI: string;
  tokenURL: string;
}

export interface FacebookAuthIntegration extends AuthIntegration {
  clientID: string;
  clientSecret: string;
}

export interface GoogleAuthIntegration extends AuthIntegration {
  clientID: string;
  clientSecret: string;
}

export type LocalAuthIntegration = AuthIntegration;

/**
 * AuthIntegrations describes all of the possible auth integration
 * configurations.
 */
export interface AuthIntegrations {
  /**
   * local is the auth integration for the email/password based auth.
   */
  local: LocalAuthIntegration;

  /**
   * sso is the external auth integration for the single sign on auth.
   */
  sso?: SSOAuthIntegration;

  /**
   * sso is the external auth integration for the OpenID Connect auth.
   */
  oidc?: OIDCAuthIntegration;

  /**
   * sso is the external auth integration for the Google auth.
   */
  google?: GoogleAuthIntegration;

  /**
   * sso is the external auth integration for the Facebook auth.
   */
  facebook?: FacebookAuthIntegration;
}

export interface Auth {
  integrations: AuthIntegrations;
}

/**
 * Akismet provides integration with the Akismet Spam detection service.
 */
export interface AkismetIntegration {
  /**
   * When true, it will enable comments to be checked by Akismet.
   */
  enabled: boolean;

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
  akismet: AkismetIntegration;
}

export interface ModerationSettings {
  moderation: GQLMODERATION_MODE;
  requireEmailConfirmation: boolean;
  infoBoxEnable: boolean;
  infoBoxContent?: string;
  questionBoxEnable: boolean;
  questionBoxIcon?: string;
  questionBoxContent?: string;
  premodLinksEnable: boolean;
  autoCloseStream: boolean;
  closedTimeout: number;
  closedMessage?: string;
  disableCommenting: boolean;
  disableCommentingMessage?: string;
  charCountEnable: boolean;
  charCount?: number;
}

/**
 * KarmaThreshold defines the bounds for which a User will become unreliable or
 * reliable based on their karma score. If the score is equal or less than the
 * unreliable value, they are unreliable. If the score is equal or more than the
 * reliable value, they are reliable. If they are neither reliable or unreliable
 * then they are neutral.
 */
export interface KarmaThreshold {
  reliable: number;
  unreliable: number;
}

export interface KarmaThresholds {
  /**
   * flag represents karma settings in relation to how well a User's flagging
   * ability aligns with the moderation decicions made by moderators.
   */
  flag: KarmaThreshold;

  /**
   * comment represents the karma setting in relation to how well a User's comments are moderated.
   */
  comment: KarmaThreshold;
}

export interface Karma {
  /**
   * When true, checks will be completed to ensure that the Karma checks are
   * completed.
   */
  enabled: boolean;

  /**
   * karmaThresholds contains the currently set thresholds for triggering Trust
   * beheviour.
   */
  thresholds: KarmaThresholds;
}

export interface Settings extends ModerationSettings {
  customCssUrl?: string;

  /**
   * editCommentWindowLength is the length of time (in milliseconds) after a
   * comment is posted that it can still be edited by the author.
   */
  editCommentWindowLength: number;

  /**
   * karma is the set of settings related to how user Trust and Karma are
   * handled.
   */
  karma: Karma;

  /**
   * wordlist stores all the banned/suspect words.
   */
  wordlist: Wordlist;

  /**
   * Set of configured authentication integrations.
   */
  auth: Auth;

  /**
   * Various integrations with external services.
   */
  integrations: ExternalIntegrations;
}
