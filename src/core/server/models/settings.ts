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

export interface AuthIntegrations {
  local: GQLLocalAuthIntegration;
  sso: GQLSSOAuthIntegration;
  oidc: OIDCAuthIntegration;
  google: GoogleAuthIntegration;
  facebook: FacebookAuthIntegration;
}

export type Auth = Omit<GQLAuth, "integrations"> & {
  /**
   * integrations are the set of configurations for the variations of
   * authentication solutions.
   */
  integrations: AuthIntegrations;
};

export type Settings = GlobalModerationSettings &
  Pick<
    GQLSettings,
    | "closeCommenting"
    | "disableCommenting"
    | "charCount"
    | "email"
    | "karma"
    | "wordList"
    | "integrations"
    | "reaction"
    | "editCommentWindowLength"
    | "customCSSURL"
    | "communityGuidelines"
  > & {
    /**
     * Set of configured authentication integrations.
     */
    auth: Auth;
  };
