import { v4 as uuid } from "uuid";

import {
  createTestMongoContext,
  createTestRedis,
  createTestTenant,
} from "coral-server/test/helpers";

it("ensure in-memory Mongo is operational", async () => {
  const mongo = await createTestMongoContext();
  const tenant = await createTestTenant(mongo);
  if (!tenant) {
    throw new Error("unable to create tenant");
  }

  const foundTenant = await mongo.tenants().findOne({ id: tenant.id });
  const deleteResult = await mongo.tenants().deleteOne({ id: tenant.id });

  expect(tenant).toBeDefined();

  expect(foundTenant).toBeDefined();
  expect(foundTenant!.id).toEqual(tenant.id);
  expect(foundTenant!.domain).toEqual(tenant.domain);

  expect(deleteResult.acknowledged).toEqual(true);
  expect(deleteResult.deletedCount).toEqual(1);
});

it("ensure in-memory Redis is operational", async () => {
  const redis = await createTestRedis();

  const key = uuid();
  const value = uuid();

  const writeResult = await redis.set(key, value);
  const retrievedValue = await redis.get(key);
  const deleteResult = await redis.del(key);

  expect(writeResult).toEqual("OK");
  expect(value).toEqual(retrievedValue);
  expect(deleteResult).toEqual(1);
});
