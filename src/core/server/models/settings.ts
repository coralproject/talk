import {
  GQLAuth,
  GQLEmail,
  GQLExternalIntegrations,
  GQLKarma,
  GQLMODERATION_MODE,
  GQLWordlist,
} from "talk-server/graph/tenant/schema/__generated__/types";

// export interface EmailDomainRuleCondition {
//   /**
//    * emailDomain is the domain name component of the email addresses that should
//    * match for this condition.
//    */
//   emailDomain: string;
//   /**
//    * emailVerifiedRequired stipulates that this rule only applies when the user
//    * account has been marked as having their email address already verified.
//    */
//   emailVerifiedRequired: boolean;
// }

// /**
//  * RoleRule describes the role assignment for when a user logs into Talk, how
//  * they can have their account automatically upgraded to a specific role when
//  * the domain for their email matches the one provided.
//  */
// export interface RoleRule extends Partial<EmailDomainRuleCondition> {
//   /**
//    * role is the specific GQLUSER_ROLE that should be assigned to the newly
//    * created user depending on their email address.
//    */
//   role: GQLUSER_ROLE;
// }

// export interface AuthRules {
//   /**
//    * roles allow the configuration of automatic role assignment based on the
//    * user's email address.
//    */
//   roles?: RoleRule[];

//   /**
//    * restrictTo when populated, will restrict which users can login using this
//    * integration. If a user successfully logs in using the OIDCStrategy, but
//    * does not match the following rules, the user will not be created.
//    */
//   restrictTo?: EmailDomainRuleCondition[];
// }

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

export interface Settings extends ModerationSettings {
  customCssUrl?: string;

  /**
   * editCommentWindowLength is the length of time (in milliseconds) after a
   * comment is posted that it can still be edited by the author.
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
   * wordlist stores all the banned/suspect words.
   */
  wordlist: GQLWordlist;

  /**
   * Set of configured authentication integrations.
   */
  auth: GQLAuth;

  /**
   * Various integrations with external services.
   */
  integrations: GQLExternalIntegrations;
}
