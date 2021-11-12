/* eslint-disable */
import { updateUserBan } from "./users";

// TODO: move these to fixtures dir
import {
  createSiteFixture,
  createTenantFixture,
  createUserFixture,
  createMockMongoContex,
  createMockMailer,
  createMockRejector,
} from "coral-server/test/fixtures";
import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

describe("updateUserBan", () => {
  afterEach(jest.clearAllMocks);
  // MARCUS: does this need to be in a beforeEach?
  jest.mock("coral-server/models/user");

  const mailer = createMockMailer();
  const rejector = createMockRejector();
  const mongo = createMockMongoContex();
  const tenant = createTenantFixture();
  const badUser = createUserFixture();
  const siteA = createSiteFixture({ tenantID: tenant.id });
  const siteB = createSiteFixture({ tenantID: tenant.id });

  it("rejects updates by non mod users", async () => {
    const commentor = createUserFixture({
      tenantID: tenant.id,
      role: GQLUSER_ROLE.COMMENTER
    });
    await expect(async () => await updateUserBan(
      mongo,
      mailer,
      rejector,
      tenant,
      commentor,
      badUser.id,
      "Test message",
      false,
      [siteA.id],
    )).rejects.toThrow(); // TODO: assert correct error

    const staff = createUserFixture({
      tenantID: tenant.id,
      role: GQLUSER_ROLE.STAFF
    });

    await expect(async () => await updateUserBan(
      mongo,
      mailer,
      rejector,
      tenant,
      staff,
      badUser.id,
      "Test message",
      false,
      [siteA.id],
    )).rejects.toThrow(); // TODO: assert correct error
  });

  it("rejects updates out of mods scope", async () => {
    const siteAMod = createUserFixture({
      tenantID: tenant.id,
      moderationScopes: {
        siteIDs: [siteA.id]
      }
    });

    await expect(async () => await updateUserBan(
      mongo,
      mailer,
      rejector,
      tenant,
      siteAMod,
      badUser.id,
      "Test message",
      false,
      [siteB.id],
    )).rejects.toThrow(); // TODO: assert correct error
  });

  it("rejects if banIds and unbanIds are overlapping", async () => {
    const orgMod = createUserFixture({
      tenantID: tenant.id,
      role: GQLUSER_ROLE.MODERATOR
    });

    await expect(async () => await updateUserBan(
      mongo,
      mailer,
      rejector,
      tenant,
      orgMod,
      badUser.id,
      "Test message",
      false,
      [siteA.id, siteB.id],
      [siteA.id]
    )).rejects.toThrow(); // TODO: assert correct error
  });

  it("skips already banned sites", async () => {
    const bannedOnSiteA = createUserFixture({
      tenantID: tenant.id,
      status: {
        ban: {
          siteIDs: [siteA.id]
        }
      }
    });

    require("coral-server/models/user").retrieveUser.mockResolvedValue(bannedOnSiteA);

    const admin = createUserFixture({
      tenantID: tenant.id,
      role: GQLUSER_ROLE.ADMIN,
    });

    const res = await updateUserBan(
      mongo,
      mailer,
      rejector,
      tenant,
      admin,
      bannedOnSiteA.id,
      "Test message",
      false,
      [siteA.id],
    );

    expect(res.id).toEqual(bannedOnSiteA.id);
    expect(require("coral-server/models/user").siteBanUser).toHaveBeenCalledTimes(0);
    expect(mailer.add).toHaveBeenCalledTimes(0); // MARCUS: not getting the mocks, hmm
  })
});
