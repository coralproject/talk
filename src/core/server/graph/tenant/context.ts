import { Db } from "mongodb";

import CommonContext from "talk-server/graph/common/context";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import TenantCache from "talk-server/services/tenant/cache";

import { Redis } from "ioredis";
import loaders from "./loaders";
import mutators from "./mutators";

export interface TenantContextOptions {
  mongo: Db;
  redis: Redis;
  tenant: Tenant;
  tenantCache: TenantCache;
  user?: User;
}

export default class TenantContext extends CommonContext {
  public loaders: ReturnType<typeof loaders>;
  public mutators: ReturnType<typeof mutators>;
  public mongo: Db;
  public redis: Redis;
  public user?: User;
  public tenant: Tenant;
  public tenantCache: TenantCache;

  constructor({
    user,
    tenant,
    mongo,
    redis,
    tenantCache,
  }: TenantContextOptions) {
    super({ user });

    this.tenant = tenant;
    this.tenantCache = tenantCache;
    this.user = user;
    this.mongo = mongo;
    this.redis = redis;
    this.loaders = loaders(this);
    this.mutators = mutators(this);
  }
}
