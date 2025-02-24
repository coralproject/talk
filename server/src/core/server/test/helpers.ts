import { Response } from "express";
import RedisClient from "ioredis";
import { v4 as uuid } from "uuid";

import { RequestLimiterOptions } from "coral-server/app/request/limiter";
import config from "coral-server/config";
import { MongoContext, MongoContextImpl } from "coral-server/data/context";
import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";
import logger from "coral-server/logger";
import { createSite, Site } from "coral-server/models/site";
import { createTenant, Tenant, updateTenant } from "coral-server/models/tenant";
import {
  createUser,
  CreateUserInput,
  hashPassword,
} from "coral-server/models/user";
import { I18n } from "coral-server/services/i18n";
import {
  JWTSigningConfig,
  SymmetricSigningAlgorithm,
} from "coral-server/services/jwt";
import { createMongoDB } from "coral-server/services/mongodb";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";
import {
  CoralRequest,
  Request,
  TenantCoralRequest,
} from "coral-server/types/express";
import { TestMailerQueue } from "./testMailerQueue";

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
): Promise<Readonly<Tenant> | null> => {
  const locales = await createTestLocales();
  let tenant: Readonly<Tenant> | null = await createTenant(mongo, locales, {
    domain: "http://localhost:8080",
    locale: "en-US",
    organization: {
      name: "Coral",
      url: "http://localhost:3000",
      contactEmail: "coral@coralproject.net",
    },
  });

  // enable SSO and set a signing secret
  // so we can test SSO flows if necessary
  tenant = await updateTenant(mongo, tenant.id, {
    auth: {
      integrations: {
        sso: {
          enabled: true,
          allowRegistration: true,
          targetFilter: {
            admin: true,
            stream: true,
          },
          signingSecrets: [
            {
              kid: "bef233358308a104f5",
              secret:
                "ssosec_f73a2830f6285e398ce7ba4917194f44c395ba76512096bc9da3c7f9c9c357dd13373b",
              createdAt: new Date(),
            },
          ],
        },
      },
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

interface CreateLocalUserInput {
  username: string;
  email: string;
  password: string;
  role: GQLUSER_ROLE;
}

export const createTestLocalUser = async (
  mongo: MongoContext,
  tenant: Readonly<Tenant>,
  input: CreateLocalUserInput,
  now = new Date()
) => {
  const details: CreateUserInput = {
    email: input.email,
    username: input.username,
    role: input.role,
    profile: {
      type: "local",
      id: input.email,
      password: await hashPassword(input.password),
      passwordID: uuid(),
    },
  };

  return await createUser(mongo, tenant.id, details, now);
};

export const createTestSigningConfig = (): JWTSigningConfig => {
  return {
    secret: "secret",
    algorithm: SymmetricSigningAlgorithm.HS256,
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
  headers: object = {},
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
    headers,
  };

  return req as unknown as Request<TenantCoralRequest>;
};

const mockedHeaderFunc = (field: string, value?: string | string[]) => {};
const mockedJsonFunc = (body?: any) => {};

export const createTestResponse = (): Response<any> => {
  return {
    header: mockedHeaderFunc,
    json: mockedJsonFunc,
  } as unknown as Response<any>;
};

export const createTestNext = () => {
  return (err?: Error | any) => {
    // eslint-disable-next-line no-console
    console.log(err);
  };
};

export const createTestEnv = async () => {
  const mongo = await createTestMongoContext();
  const redis = await createTestRedis();

  const tenant = await createTestTenant(mongo);
  if (!tenant) {
    throw new Error("unable to create test tenant");
  }

  const tenantCache = await createTestTenantCache(mongo, redis);
  await tenantCache.update(redis, tenant);

  const site = await createTestSite(mongo, tenant.id);

  const signingConfig = createTestSigningConfig();
  const mailerQueue = new TestMailerQueue();

  return {
    mongo,
    redis,
    tenant,
    tenantCache,
    site,
    signingConfig,
    mailerQueue,
  };
};
