import RedisClient from "ioredis";

import { MongoContext, MongoContextImpl } from "coral-server/data/context";
import { createTenant, Tenant } from "coral-server/models/tenant";
import { I18n } from "coral-server/services/i18n";
import { createMongoDB } from "coral-server/services/mongodb";
import { AugmentedRedis } from "coral-server/services/redis";

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
