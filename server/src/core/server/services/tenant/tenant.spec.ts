import { patchTextUtil } from "coral-server/test/textEncoder";
patchTextUtil();

import { createEmailDomain } from "./tenant";
jest.mock("coral-server/models/user");
jest.mock("coral-server/models/site");

import { UserForbiddenError } from "coral-server/errors";
import {
  GQLNEW_USER_MODERATION,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";
import {
  createSiteFixture,
  createTenantFixture,
  createUserFixture,
} from "coral-server/test/fixtures";
import {
  createMockMongoContex,
  createMockRedis,
  createMockTenantCache,
} from "coral-server/test/mocks";

const { ctx: mockMongo } = createMockMongoContex();
const mockRedis = createMockRedis();
const mockTenantCache = createMockTenantCache();

/* eslint-disable-next-line */
const userService = require("coral-server/models/user");
/* eslint-disable-next-line */
const siteService = require("coral-server/models/site");

afterEach(jest.clearAllMocks);

describe("createEmailDomain", () => {
  const tenant = createTenantFixture();
  const mockSite = createSiteFixture({
    tenantID: tenant.id,
  });
  const mockAdmin = createUserFixture({
    role: GQLUSER_ROLE.ADMIN,
    tenantID: mockSite.tenantID,
  });

  it("does not allow users to create email domain bans for sites they do not belong to", async () => {
    const otherTenant = createTenantFixture();
    const otherSite = createSiteFixture({
      tenantID: otherTenant.id,
    });
    userService.retrieveUser.mockResolvedValue(mockAdmin);
    siteService.retrieveTenantSites.mockResolvedValue([otherSite]);
    const shouldFail = async () =>
      await createEmailDomain(
        mockMongo,
        mockRedis,
        mockTenantCache,
        otherTenant,
        mockAdmin,
        {
          domain: "badsite.com",
          newUserModeration: GQLNEW_USER_MODERATION.BAN,
        }
      );

    void expect(shouldFail).rejects.toThrow(UserForbiddenError);
  });
});

it("does not create domain bans for protected domains", async () => {
  const tenant = createTenantFixture();
  const viewer = createUserFixture({
    tenantID: tenant.id,
    role: GQLUSER_ROLE.ADMIN,
  });
  const protectedDomain = "gmail.com";
  await expect(async () =>
    createEmailDomain(mockMongo, mockRedis, mockTenantCache, tenant, viewer, {
      domain: protectedDomain,
      newUserModeration: GQLNEW_USER_MODERATION.BAN,
    })
  ).rejects.toThrow("EMAIL_DOMAIN_PROTECTED");
});
