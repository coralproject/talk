import { signupHandler } from "coral-server/app/handlers";
import config from "coral-server/config";
import {
  createTestLimiterOptions,
  createTestMongoContext,
  createTestNext,
  createTestRedis,
  createTestRequest,
  createTestResponse,
  createTestSigningConfig,
  createTestSite,
  createTestTenant,
  createTestTenantCache,
} from "coral-server/test/helpers";
import { TestMailerQueue } from "coral-server/test/testMailerQueue";

it("user can sign up", async () => {
  const mongo = await createTestMongoContext();
  const redis = await createTestRedis();

  const tenant = await createTestTenant(mongo);
  const tenantCache = await createTestTenantCache(mongo, redis);
  await tenantCache.update(redis, tenant);

  const site = await createTestSite(mongo, tenant.id);

  const signingConfig = createTestSigningConfig();
  const mailerQueue = new TestMailerQueue();

  const handler = signupHandler({
    config,
    redis,
    mongo,
    signingConfig,
    mailerQueue,
    limiterOptions: createTestLimiterOptions(redis),
  });

  const body = {
    username: "test",
    email: "test@test.com",
    password: "password",
  };

  const req = createTestRequest(tenantCache, tenant, site, body);
  const res = createTestResponse();
  const next = createTestNext();

  await handler(req, res, next);

  const user = await mongo.users().findOne({ email: body.email });

  expect(user).toBeDefined();
});
