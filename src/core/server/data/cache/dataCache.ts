import { MongoContext } from "coral-server/data/context";
import { Logger } from "coral-server/logger";
import { hasFeatureFlag } from "coral-server/models/tenant";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";

import { GQLFEATURE_FLAG } from "coral-server/graph/schema/__generated__/types";

import { CommentActionsCache } from "./commentActionsCache";
import { CommentCache } from "./commentCache";
import { UserCache } from "./userCache";

export const DEFAULT_DATA_EXPIRY_SECONDS = 24 * 60 * 60;

export const dataCacheAvailable = async (
  tenantCache: TenantCache | null,
  tenantID: string
): Promise<boolean> => {
  if (!tenantCache) {
    return false;
  }

  const tenant = await tenantCache.retrieveByID(tenantID);
  if (!tenant) {
    return false;
  }

  return hasFeatureFlag(tenant, GQLFEATURE_FLAG.DATA_CACHE);
};

export interface IDataCache {
  available(tenantID: string): Promise<boolean>;
}

export class DataCache implements IDataCache {
  private mongo: MongoContext;
  private redis: AugmentedRedis;
  private tenantCache: TenantCache;
  private logger: Logger;

  private expirySeconds: number;

  public readonly comments: CommentCache;
  public readonly users: UserCache;
  public readonly commentActions: CommentActionsCache;

  private traceID = "c2603e5c-1de3-46f1-80fb-9dcc3b4e2c22";

  constructor(
    mongo: MongoContext,
    redis: AugmentedRedis,
    tenantCache: TenantCache,
    logger: Logger,
    disableCaching?: boolean,
    expirySeconds: number = DEFAULT_DATA_EXPIRY_SECONDS
  ) {
    this.mongo = mongo;
    this.redis = redis;
    this.tenantCache = tenantCache;
    this.logger = logger.child({ traceID: this.traceID });
    this.expirySeconds = expirySeconds;

    this.comments = new CommentCache(
      this.mongo,
      this.redis,
      this.tenantCache,
      this.logger,
      Boolean(disableCaching),
      this.expirySeconds
    );
    this.commentActions = new CommentActionsCache(
      this.mongo,
      this.redis,
      this.tenantCache,
      this.logger,
      this.expirySeconds
    );
    this.users = new UserCache(
      this.mongo,
      this.redis,
      this.tenantCache,
      this.logger,
      this.expirySeconds
    );
  }

  public async available(tenantID: string): Promise<boolean> {
    return dataCacheAvailable(this.tenantCache, tenantID);
  }
}
