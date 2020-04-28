import { Profile, Strategy } from "passport-facebook";

import OAuth2Strategy, {
  OAuth2StrategyOptions,
} from "coral-server/app/middleware/passport/strategies/oauth2";
import { constructTenantURL } from "coral-server/app/url";
import {
  AuthIntegrations,
  FacebookAuthIntegration,
} from "coral-server/models/settings";
import { Tenant } from "coral-server/models/tenant";
import {
  FacebookProfile,
  retrieveUserWithProfile,
} from "coral-server/models/user";
import { findOrCreate } from "coral-server/services/users";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

export type FacebookStrategyOptions = OAuth2StrategyOptions;

export default class FacebookStrategy extends OAuth2Strategy<
  FacebookAuthIntegration,
  Strategy
> {
  public name = "facebook";

  constructor(options: FacebookStrategyOptions) {
    super({
      ...options,
      authenticateOptions: {
        display: "popup",
        scope: ["email"],
      },
    });
  }

  protected getIntegration = (integrations: AuthIntegrations) =>
    integrations.facebook;

  protected async findOrCreateUser(
    tenant: Tenant,
    integration: Required<FacebookAuthIntegration>,
    { id, photos, emails }: Profile,
    now = new Date()
  ) {
    // Create the user profile that will be used to lookup the User.
    const profile: FacebookProfile = {
      type: "facebook",
      id,
    };

    const user = await retrieveUserWithProfile(this.mongo, tenant.id, profile);
    if (user) {
      return user;
    }

    if (!integration.allowRegistration) {
      // Registration is disabled, so we can't create the user user here.
      return null;
    }

    // FIXME: implement rules.

    // Try to get the avatar.
    let avatar: string | undefined;
    if (photos && photos.length > 0) {
      avatar = photos[0].value;
    }

    // Try to get the email address.
    let email: string | undefined;
    let emailVerified: boolean | undefined;
    if (emails && emails.length > 0) {
      email = emails[0].value;
      emailVerified = false;
    }

    return findOrCreate(
      this.mongo,
      this.redis,
      tenant,
      {
        role: GQLUSER_ROLE.COMMENTER,
        email,
        emailVerified,
        avatar,
        profile,
      },
      {},
      now
    );
  }

  protected createStrategy(
    tenant: Tenant,
    integration: Required<FacebookAuthIntegration>
  ) {
    return new Strategy(
      {
        clientID: integration.clientID,
        clientSecret: integration.clientSecret,
        callbackURL: constructTenantURL(
          this.config,
          tenant,
          "/api/auth/facebook/callback"
        ),
        profileFields: ["id", "displayName", "photos", "email"],
        enableProof: true,
        passReqToCallback: true,
      },
      this.verifyCallback
    );
  }
}
