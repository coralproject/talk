import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

import {
  createVerifiers,
  verifyAndRetrieveUser,
} from "coral-server/app/middleware/passport/strategies/jwt";
import config from "coral-server/config";
import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";
import { createTestEnv, createTestLocalUser } from "coral-server/test/helpers";

it("sso user, can verify and retrieve user", async () => {
  const { mongo, redis, tenant, tenantCache, signingConfig } =
    await createTestEnv();

  const signingSecret = tenant.auth.integrations.sso.signingSecrets[0];

  const tokenPayload = {
    user: {
      id: uuid(),
      email: "somebody@test.com",
      username: "somebody",
      role: GQLUSER_ROLE.COMMENTER,
    },
  };
  const token = jwt.sign(tokenPayload, signingSecret.secret);

  const verifiers = createVerifiers({
    mongo,
    redis,
    tenantCache,
    config,
    signingConfig,
  });

  const result = await verifyAndRetrieveUser(
    verifiers,
    tenant,
    token,
    new Date()
  );

  expect(result).toBeDefined();
  expect(result?.id).toEqual(tokenPayload.user.id);
  expect(result?.email).toEqual(tokenPayload.user.email);
});

it("local user, can verify and retrieve user", async () => {
  const { mongo, redis, tenant, tenantCache, signingConfig } =
    await createTestEnv();

  const user = await createTestLocalUser(mongo, tenant, {
    username: "test-user-verify-local",
    email: "verifylocal@test.com",
    role: GQLUSER_ROLE.COMMENTER,
    password: "special-password",
  });

  const tokenPayload = {
    jti: uuid(),
    iss: tenant.id,
    sub: user.id,
    iat: Date.now() / 1000,
    exp: (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000,
  };
  const token = jwt.sign(tokenPayload, signingConfig.secret);

  const verifiers = createVerifiers({
    mongo,
    redis,
    tenantCache,
    config,
    signingConfig,
  });

  const result = await verifyAndRetrieveUser(
    verifiers,
    tenant,
    token,
    new Date()
  );

  expect(result).toBeDefined();
  expect(result?.id).toEqual(user.id);
  expect(result?.email).toEqual(user.email);
});

it("local user can be connected with sso profile", async () => {
  const { mongo, redis, tenant, tenantCache, signingConfig } =
    await createTestEnv();

  const user = await createTestLocalUser(mongo, tenant, {
    username: "local-upgrade-to-sso",
    email: "localupgradetosso@test.com",
    role: GQLUSER_ROLE.COMMENTER,
    password: "special-password",
  });

  const signingSecret = tenant.auth.integrations.sso.signingSecrets[0];

  const tokenPayload = {
    user: {
      id: user.id,
      email: user.email,
      username: "somebody",
      role: GQLUSER_ROLE.COMMENTER,
    },
  };
  const token = jwt.sign(tokenPayload, signingSecret.secret);

  const verifiers = createVerifiers({
    mongo,
    redis,
    tenantCache,
    config,
    signingConfig,
  });

  const result = await verifyAndRetrieveUser(
    verifiers,
    tenant,
    token,
    new Date()
  );

  expect(result).toBeDefined();
  expect(result?.id).toEqual(user.id);
  expect(result?.email).toEqual(user.email);
  expect(result?.profiles?.find((p) => p.type === "local")).toBeDefined();
  expect(result?.profiles?.find((p) => p.type === "sso")).toBeDefined();
});
