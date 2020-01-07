import { Profile, Strategy } from "passport-google-oauth2";

import OAuth2Strategy, {
  OAuth2StrategyOptions,
} from "coral-server/app/middleware/passport/strategies/oauth2";
import { constructTenantURL } from "coral-server/app/url";
import {
  AuthIntegrations,
  GoogleAuthIntegration,
} from "coral-server/models/settings";
import { Tenant } from "coral-server/models/tenant";
import {
  GoogleProfile,
  retrieveUserWithProfile,
} from "coral-server/models/user";
import { findOrCreate } from "coral-server/services/users";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

export type GoogleStrategyOptions = OAuth2StrategyOptions;

export default class GoogleStrategy extends OAuth2Strategy<
  GoogleAuthIntegration,
  Strategy
> {
  public name = "google";

  constructor(options: GoogleStrategyOptions) {
    super({
      ...options,
      authenticateOptions: {
        scope: ["profile", "email"],
      },
    });
  }

  protected getIntegration = (integrations: AuthIntegrations) =>
    integrations.google;

  protected async findOrCreateUser(
    tenant: Tenant,
    integration: Required<GoogleAuthIntegration>,
    { id, photos, emails }: Profile,
    now = new Date()
  ) {
    // Create the user profile that will be used to lookup the User.
    const profile: GoogleProfile = {
      type: "google",
      id,
    };

    let user = await retrieveUserWithProfile(this.mongo, tenant.id, profile);
    if (!user) {
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

      user = await findOrCreate(
        this.mongo,
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

    // TODO: maybe update user details?

    return user;
  }

  protected createStrategy(
    tenant: Tenant,
    integration: Required<GoogleAuthIntegration>
  ) {
    return new Strategy(
      {
        clientID: integration.clientID,
        clientSecret: integration.clientSecret,
        callbackURL: constructTenantURL(
          this.config,
          tenant,
          "/api/auth/google/callback"
        ),
        passReqToCallback: true,
      },
      this.verifyCallback
    );
  }
}
