import { Db } from "mongodb";
import { Profile, Strategy as BaseStrategy, StrategyCreated } from "passport";
import { VerifyCallback } from "passport-oauth2";
import { Strategy } from "passport-strategy";

import { Config } from "coral-server/config";
import { IntegrationDisabled } from "coral-server/errors";
import { AuthIntegrations } from "coral-server/models/settings";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import {
  TenantCache,
  TenantCacheAdapter,
} from "coral-server/services/tenant/cache";
import { Request, TenantCoralRequest } from "coral-server/types/express";

interface OAuth2Integration {
  enabled: boolean;
  clientID?: string;
  clientSecret?: string;
}

export interface OAuth2StrategyOptions {
  config: Config;
  mongo: Db;
  tenantCache: TenantCache;
  authenticateOptions?: Record<string, any>;
}

export default abstract class OAuth2Strategy<
  T extends OAuth2Integration,
  U extends BaseStrategy
> extends Strategy {
  public abstract name: string;
  protected config: Config;
  protected mongo: Db;
  protected cache: TenantCacheAdapter<Strategy>;
  private authenticateOptions: Record<string, any>;

  constructor({
    config,
    mongo,
    tenantCache,
    authenticateOptions,
  }: OAuth2StrategyOptions) {
    super();

    this.config = config;
    this.mongo = mongo;
    this.cache = new TenantCacheAdapter(tenantCache);
    this.authenticateOptions = authenticateOptions || {};
  }

  protected abstract getIntegration(integrations: AuthIntegrations): T;

  protected abstract createStrategy(
    tenant: Tenant,
    integration: Required<T>
  ): U;

  protected abstract findOrCreateUser(
    tenant: Tenant,
    integration: Required<T>,
    profile: Profile,
    now: Date
  ): Promise<User | null | undefined>;

  protected verifyCallback = async (
    req: Request<TenantCoralRequest>,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) => {
    try {
      const { tenant, now } = req.coral;

      // Get the integration.
      const integration = this.getIntegration(tenant.auth.integrations);

      // Find or create the user.
      const user = await this.findOrCreateUser(
        tenant,
        integration as Required<T>,
        profile,
        now
      );
      if (!user) {
        return done(null);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  };

  public authenticate(req: Request<TenantCoralRequest>) {
    try {
      const { tenant } = req.coral;

      // Get the integration.
      const integration = this.getIntegration(tenant.auth.integrations);

      // Check to see if the integration is enabled.
      if (!integration.enabled) {
        throw new IntegrationDisabled(this.name);
      }

      if (!integration.clientID) {
        throw new Error("clientID is missing in configuration");
      }

      if (!integration.clientSecret) {
        throw new Error("clientSecret is missing in configuration");
      }

      let strategy = this.cache.get(tenant.id);
      if (!strategy) {
        strategy = this.createStrategy(
          tenant,
          integration as Required<T>
        ) as StrategyCreated<U>;

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
        ...this.authenticateOptions,
      });
    } catch (err) {
      return this.error(err);
    }
  }
}
