import { signupHandler } from "coral-server/app/handlers";
import config from "coral-server/config";
import {
  createTestEnv,
  createTestLimiterOptions,
  createTestNext,
  createTestRequest,
  createTestResponse,
} from "coral-server/test/helpers";

it("user can sign up", async () => {
  const {
    mongo,
    redis,
    tenant,
    tenantCache,
    site,
    signingConfig,
    mailerQueue,
  } = await createTestEnv();

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
  expect(user!.email).toEqual(body.email);
  expect(user!.username).toEqual(body.username);
});
