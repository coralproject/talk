import { Db } from "mongodb";

import { Config } from "talk-server/config";
import CommonContext from "talk-server/graph/common/context";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import { TaskQueue } from "talk-server/queue";
import { JWTSigningConfig } from "talk-server/services/jwt";
import { AugmentedRedis } from "talk-server/services/redis";
import TenantCache from "talk-server/services/tenant/cache";
import { Request } from "talk-server/types/express";

import { I18n } from "talk-server/services/i18n";
import loaders from "./loaders";
import mutators from "./mutators";

export interface TenantContextOptions {
  mongo: Db;
  redis: AugmentedRedis;
  tenant: Tenant;
  tenantCache: TenantCache;
  queue: TaskQueue;
  config: Config;
  signingConfig?: JWTSigningConfig;
  req?: Request;
  user?: User;
  i18n: I18n;
}

export default class TenantContext extends CommonContext {
  public readonly tenant: Tenant;
  public readonly tenantCache: TenantCache;
  public readonly mongo: Db;
  public readonly redis: AugmentedRedis;
  public readonly queue: TaskQueue;
  public readonly loaders: ReturnType<typeof loaders>;
  public readonly mutators: ReturnType<typeof mutators>;
  public readonly user?: User;
  public readonly signingConfig?: JWTSigningConfig;

  constructor({
    req,
    user,
    tenant,
    mongo,
    redis,
    config,
    tenantCache,
    queue,
    signingConfig,
    i18n,
  }: TenantContextOptions) {
    super({ user, req, config, i18n, lang: tenant.locale });

    this.tenant = tenant;
    this.tenantCache = tenantCache;
    this.user = user;
    this.mongo = mongo;
    this.redis = redis;
    this.queue = queue;
    this.signingConfig = signingConfig;
    this.loaders = loaders(this);
    this.mutators = mutators(this);
  }
}
