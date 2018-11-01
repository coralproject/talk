import { Db } from "mongodb";
import { Strategy } from "passport-strategy";

import { Profile } from "passport";
import { VerifyCallback } from "passport-oauth2";
import { Config } from "talk-common/config";
import { GQLAuthIntegrations } from "talk-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import TenantCache from "talk-server/services/tenant/cache";
import { TenantCacheAdapter } from "talk-server/services/tenant/cache/adapter";
import { Request } from "talk-server/types/express";

interface OAuth2Integration {
  enabled: boolean;
  clientID?: string;
  clientSecret?: string;
}

export interface OAuth2StrategyOptions {
  config: Config;
  mongo: Db;
  tenantCache: TenantCache;
  scope?: string[];
}

export default abstract class OAuth2Strategy<
  T extends OAuth2Integration,
  U extends Strategy
> extends Strategy {
  protected config: Config;
  protected mongo: Db;
  protected cache: TenantCacheAdapter<U>;
  private scope?: string[];

  constructor({ config, mongo, tenantCache, scope }: OAuth2StrategyOptions) {
    super();

    this.config = config;
    this.mongo = mongo;
    this.cache = new TenantCacheAdapter(tenantCache);
    this.scope = scope;
  }

  protected abstract getIntegration(integrations: GQLAuthIntegrations): T;

  protected abstract createStrategy(
    tenant: Tenant,
    integration: Required<T>
  ): U;

  protected abstract findOrCreateUser(
    tenant: Tenant,
    integration: Required<T>,
    profile: Profile
  ): Promise<User | undefined>;

  protected verifyCallback = async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => {
    try {
      // Talk is defined at this point.
      const tenant = req.talk!.tenant!;

      // Get the integration.
      const integration = this.getIntegration(tenant.auth.integrations);

      // Get the user.
      const user = await this.findOrCreateUser(
        tenant,
        integration as Required<T>,
        profile
      );

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  };

  public authenticate(req: Request) {
    try {
      // Talk is defined at this point.
      const tenant = req.talk!.tenant!;

      // Get the integration.
      const integration = this.getIntegration(tenant.auth.integrations);

      // Check to see if the integration is enabled.
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

      let strategy = this.cache.get(tenant.id);
      if (!strategy) {
        strategy = this.createStrategy(tenant, integration as Required<T>);
        this.cache.set(tenant.id, strategy);
      }

      // Augment the strategy with the request method bindings.
      strategy.error = this.error.bind(this);
      strategy.fail = this.fail.bind(this);
      strategy.pass = this.pass.bind(this);
      strategy.redirect = this.redirect.bind(this);
      strategy.success = this.success.bind(this);

      strategy.authenticate(req, {
        session: false,
        scope: this.scope,
      });
    } catch (err) {
      return this.error(err);
    }
  }
}
