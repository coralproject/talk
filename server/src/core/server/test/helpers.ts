import { Response } from "express";
import RedisClient from "ioredis";
import { v4 as uuid } from "uuid";

import { RequestLimiterOptions } from "coral-server/app/request/limiter";
import config from "coral-server/config";
import { MongoContext, MongoContextImpl } from "coral-server/data/context";
import logger from "coral-server/logger";
import { createSite, Site } from "coral-server/models/site";
import { createTenant, Tenant } from "coral-server/models/tenant";
import { I18n } from "coral-server/services/i18n";
import {
  AsymmetricSigningAlgorithm,
  JWTSigningConfig,
} from "coral-server/services/jwt";
import { createMongoDB } from "coral-server/services/mongodb";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";
import {
  CoralRequest,
  Request,
  TenantCoralRequest,
} from "coral-server/types/express";

export const createTestMongoContext = async (): Promise<MongoContext> => {
  const uri = process.env.MONGO_TEST_URI ?? "";
  const mongo = await createMongoDB(uri, 50);
  const context = new MongoContextImpl(mongo.db);

  return context;
};

export const createTestRedis = async (): Promise<AugmentedRedis> => {
  const uri = process.env.REDIS_TEST_URI ?? "";
  const redis = new RedisClient(uri, { lazyConnect: false });

  return redis as AugmentedRedis;
};

export const createTestLocales = async (): Promise<I18n> => {
  const i18n = new I18n("en-US");
  await i18n.load();

  return i18n;
};

export const createTestTenantCache = async (
  mongo: MongoContext,
  redis: AugmentedRedis
): Promise<TenantCache> => {
  return new TenantCache(mongo, redis, config);
};

export const createTestTenant = async (
  mongo: MongoContext
): Promise<Readonly<Tenant>> => {
  const locales = await createTestLocales();
  const tenant = await createTenant(mongo, locales, {
    domain: "http://localhost:8080",
    locale: "en-US",
    organization: {
      name: "Coral",
      url: "http://localhost:3000",
      contactEmail: "coral@coralproject.net",
    },
  });

  return tenant;
};

export const createTestSite = async (
  mongo: MongoContext,
  tenantID: string,
  allowedOrigins = ["http://localhost:8080"]
): Promise<Readonly<Site>> => {
  const site = await createSite(mongo, {
    tenantID,
    name: `Test Site ${uuid()}`,
    allowedOrigins,
  });

  return site;
};

export const createTestSigningConfig = (): JWTSigningConfig => {
  return {
    secret: "secret",
    algorithm: AsymmetricSigningAlgorithm.RS256,
  };
};

export const createTestLimiterOptions = (
  redis: AugmentedRedis
): RequestLimiterOptions => {
  return {
    redis,
    ttl: "1m",
    max: 1000,
    prefix: "ip",
    config,
  };
};

export const createTestRequest = (
  tenantCache: TenantCache,
  tenant: Readonly<Tenant>,
  site: Site,
  body: object = {},
  now = new Date()
): Request<TenantCoralRequest> => {
  const coral: CoralRequest = {
    id: uuid(),
    now,
    cache: {
      tenant: tenantCache,
    },
    tenant,
    site,
    logger,
  };

  const req = {
    coral,
    body,
  };

  return req as unknown as Request<TenantCoralRequest>;
};

export const createTestResponse = (): Response<any> => {
  return {} as unknown as Response<any>;
};

export const createTestNext = () => {
  return (err?: Error | any) => {
    // eslint-disable-next-line no-console
    console.log(err);
  };
};
