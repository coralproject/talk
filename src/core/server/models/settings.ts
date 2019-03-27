import { Omit } from "talk-common/types";
import {
  GQLAuth,
  GQLFacebookAuthIntegration,
  GQLGoogleAuthIntegration,
  GQLLocalAuthIntegration,
  GQLMODERATION_MODE,
  GQLOIDCAuthIntegration,
  GQLSettings,
  GQLSSOAuthIntegration,
} from "talk-server/graph/tenant/schema/__generated__/types";

export interface GlobalModerationSettings {
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

/**
 * AuthIntegrations are the set of configurations for the variations of
 * authentication solutions.
 */
export interface AuthIntegrations {
  local: GQLLocalAuthIntegration;
  sso: GQLSSOAuthIntegration;
  oidc: OIDCAuthIntegration;
  google: GoogleAuthIntegration;
  facebook: FacebookAuthIntegration;
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
    | "karma"
    | "wordList"
    | "integrations"
    | "reaction"
    | "editCommentWindowLength"
    | "customCSSURL"
    | "communityGuidelines"
    | "createdAt"
  > & {
    /**
     * auth is the set of configured authentication integrations.
     */
    auth: Auth;

    /**
     * closeCommenting contains settings related to the automatic closing of commenting on
     * Stories.
     */
    closeCommenting: CloseCommenting;

    /**
     * disableCommenting will disable commenting site-wide.
     */
    disableCommenting: DisableCommenting;
  };
