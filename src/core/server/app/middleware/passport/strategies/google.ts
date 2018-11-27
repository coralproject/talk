import { Db } from "mongodb";
import { Profile, Strategy } from "passport-google-oauth2";

import { Config } from "talk-common/config";
import OAuth2Strategy from "talk-server/app/middleware/passport/strategies/oauth2";
import { constructTenantURL } from "talk-server/app/url";
import {
  GQLAuthIntegrations,
  GQLGoogleAuthIntegration,
  GQLUSER_ROLE,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "talk-server/models/tenant";
import {
  GoogleProfile,
  retrieveUserWithProfile,
} from "talk-server/models/user";
import TenantCache from "talk-server/services/tenant/cache";
import { upsert } from "talk-server/services/users";

export interface GoogleStrategyOptions {
  config: Config;
  mongo: Db;
  tenantCache: TenantCache;
}

export interface GoogleStrategyOptions {
  config: Config;
  mongo: Db;
  tenantCache: TenantCache;
}

export default class GoogleStrategy extends OAuth2Strategy<
  GQLGoogleAuthIntegration,
  Strategy
> {
  public name = "google";

  constructor(options: GoogleStrategyOptions) {
    super({
      ...options,
      scope: ["profile"],
    });
  }

  protected getIntegration = (integrations: GQLAuthIntegrations) =>
    integrations.google;

  protected async findOrCreateUser(
    tenant: Tenant,
    integration: Required<GQLGoogleAuthIntegration>,
    { id, photos, emails, displayName }: Profile
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
        return;
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

      user = await upsert(this.mongo, tenant, {
        username: null,
        displayName,
        role: GQLUSER_ROLE.COMMENTER,
        email,
        emailVerified,
        avatar,
        profiles: [profile],
      });
    }

    // TODO: maybe update user details?

    return user;
  }

  protected createStrategy(
    tenant: Tenant,
    integration: Required<GQLGoogleAuthIntegration>
  ) {
    return new Strategy(
      {
        clientID: integration.clientID,
        clientSecret: integration.clientSecret,
        callbackURL: constructTenantURL(
          this.config,
          tenant,
          "/api/tenant/auth/google/callback"
        ),
        passReqToCallback: true,
      },
      this.verifyCallback
    );
  }
}
