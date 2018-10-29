import { Db } from "mongodb";
import {
  Profile,
  Strategy as FacebookPassportStrategy,
} from "passport-facebook";
import { VerifyCallback } from "passport-oauth2";
import { Strategy } from "passport-strategy";

import { Config } from "talk-common/config";
import { reconstructTenantURL } from "talk-server/app/url";
import {
  GQLFacebookAuthIntegration,
  GQLUSER_ROLE,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "talk-server/models/tenant";
import {
  FacebookProfile,
  retrieveUserWithProfile,
} from "talk-server/models/user";
import TenantCache from "talk-server/services/tenant/cache";
import { TenantCacheAdapter } from "talk-server/services/tenant/cache/adapter";
import { upsert } from "talk-server/services/users";
import { Request } from "talk-server/types/express";

async function findOrCreateFacebookUser(
  mongo: Db,
  tenant: Tenant,
  integration: GQLFacebookAuthIntegration,
  { id, photos, emails, displayName }: Profile
) {
  // Create the user profile that will be used to lookup the User.
  const profile: FacebookProfile = {
    type: "facebook",
    id,
  };

  let user = await retrieveUserWithProfile(mongo, tenant.id, profile);
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

    user = await upsert(mongo, tenant, {
      username: null,
      displayName,
      role: GQLUSER_ROLE.COMMENTER,
      email,
      email_verified: emailVerified,
      avatar,
      profiles: [profile],
    });
  }

  return user;
}

function getEnabledIntegration(
  tenant: Tenant
): Required<GQLFacebookAuthIntegration> {
  const integration = tenant.auth.integrations.facebook;

  // Handle when the integration is enabled/disabled.
  if (!integration.enabled) {
    // TODO: return a better error.
    throw new Error("integration not enabled");
  }
  if (!integration.enabled) {
    // TODO: return a better error.
    throw new Error("integration not enabled");
  }

  if (!integration.clientID) {
    throw new Error("clientID is missing in configuration");
  }

  if (!integration.clientSecret) {
    throw new Error("clientSecret is missing in configuration");
  }

  // TODO: (wyattjoh) for some reason, type guards above to not allow coercion to this required type.
  return integration as Required<GQLFacebookAuthIntegration>;
}

export interface FacebookStrategyOptions {
  config: Config;
  mongo: Db;
  tenantCache: TenantCache;
}

export default class FacebookStrategy extends Strategy {
  public name = "facebook";

  private config: Config;
  private mongo: Db;
  private cache: TenantCacheAdapter<FacebookPassportStrategy>;

  constructor({ config, mongo, tenantCache }: FacebookStrategyOptions) {
    super();

    this.config = config;
    this.mongo = mongo;
    this.cache = new TenantCacheAdapter(tenantCache);
  }

  private userAuthenticatedCallback = async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => {
    const { tenant } = req.talk!;
    if (!tenant) {
      // TODO: return a better error.
      throw new Error("tenant not found");
    }

    // Get the integration from the tenant. If needed, it will be used to create
    // a new strategy.
    let integration: Required<GQLFacebookAuthIntegration>;
    try {
      integration = getEnabledIntegration(tenant);
    } catch (err) {
      // TODO: wrap error?
      return done(err);
    }

    try {
      const user = await findOrCreateFacebookUser(
        this.mongo,
        tenant,
        integration,
        profile
      );

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  };

  public authenticate(req: Request) {
    try {
      const { tenant } = req.talk!;
      if (!tenant) {
        // TODO: return a better error.
        throw new Error("tenant not found");
      }

      // Get the integration (it will throw if the integration is not enabled).
      const integration = getEnabledIntegration(tenant);

      let strategy = this.cache.get(tenant.id);
      if (!strategy) {
        strategy = new FacebookPassportStrategy(
          {
            clientID: integration.clientID,
            clientSecret: integration.clientSecret,
            callbackURL: reconstructTenantURL(
              this.config,
              tenant,
              "/api/tenant/auth/facebook/callback"
            ),
            profileFields: ["id", "displayName", "photos", "email"],
            enableProof: true,
            passReqToCallback: true,
          },
          this.userAuthenticatedCallback
        );

        this.cache.set(tenant.id, strategy);
      }

      // Augment the strategy with the request method bindings.
      strategy.error = this.error.bind(this);
      strategy.fail = this.fail.bind(this);
      strategy.pass = this.pass.bind(this);
      strategy.redirect = this.redirect.bind(this);
      strategy.success = this.success.bind(this);

      strategy.authenticate(req, { session: false });
    } catch (err) {
      return this.error(err);
    }
  }
}
