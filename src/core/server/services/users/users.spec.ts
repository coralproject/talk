jest.mock("coral-server/models/user");

import { UserForbiddenError, ValidationError } from "coral-server/errors";
import {
  createSiteFixture,
  createTenantFixture,
  createUserFixture,
} from "coral-server/test/fixtures";
import {
  createMockMailer,
  createMockMongoContex,
  createMockRejector,
} from "coral-server/test/mocks";

import { updateRole, updateUserBan } from "./users";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

describe("updateUserBan", () => {
  afterEach(jest.clearAllMocks);

  const mailer = createMockMailer();
  const rejector = createMockRejector();
  const mongo = createMockMongoContex();
  const tenant = createTenantFixture();
  const tenantID = tenant.id;
  const badUser = createUserFixture();
  const siteA = createSiteFixture({ tenantID: tenant.id });
  const siteB = createSiteFixture({ tenantID: tenant.id });
  const admin = createUserFixture({
    tenantID,
    role: GQLUSER_ROLE.ADMIN,
  });

  /* eslint-disable-next-line */
  const userService = require("coral-server/models/user");

  it("rejects updates by non mod users", async () => {
    const commenter = createUserFixture({
      tenantID: tenant.id,
      role: GQLUSER_ROLE.COMMENTER,
    });
    await expect(
      async () =>
        await updateUserBan(
          mongo,
          mailer,
          rejector,
          tenant,
          commenter,
          badUser.id,
          "Test message",
          false,
          [siteA.id]
        )
    ).rejects.toThrow(UserForbiddenError);

    const staff = createUserFixture({
      tenantID: tenant.id,
      role: GQLUSER_ROLE.STAFF,
    });

    await expect(
      async () =>
        await updateUserBan(
          mongo,
          mailer,
          rejector,
          tenant,
          staff,
          badUser.id,
          "Test message",
          false,
          [siteA.id]
        )
    ).rejects.toThrow(UserForbiddenError);
  });

  it("rejects updates out of mods scope", async () => {
    const siteAMod = createUserFixture({
      tenantID: tenant.id,
      moderationScopes: {
        siteIDs: [siteA.id],
      },
    });

    await expect(
      async () =>
        await updateUserBan(
          mongo,
          mailer,
          rejector,
          tenant,
          siteAMod,
          badUser.id,
          "Test message",
          false,
          [siteB.id]
        )
    ).rejects.toThrow(UserForbiddenError);
  });

  it("rejects if banIds and unbanIds are overlapping", async () => {
    const orgMod = createUserFixture({
      tenantID: tenant.id,
      role: GQLUSER_ROLE.MODERATOR,
    });

    await expect(
      async () =>
        await updateUserBan(
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
        )
    ).rejects.toThrow(ValidationError);
  });

  it("skips already banned sites", async () => {
    const bannedOnSiteA = createUserFixture({
      tenantID: tenant.id,
      status: {
        ban: {
          siteIDs: [siteA.id],
        },
      },
    });

    /* eslint-disable-next-line */
    require("coral-server/models/user").retrieveUser.mockResolvedValue(bannedOnSiteA);

    const res = await updateUserBan(
      mongo,
      mailer,
      rejector,
      tenant,
      admin,
      bannedOnSiteA.id,
      "Test message",
      false,
      [siteA.id]
    );

    expect(res.id).toEqual(bannedOnSiteA.id);
    expect(
      /* eslint-disable-next-line */
      userService.siteBanUser
    ).toHaveBeenCalledTimes(0);
    expect(mailer.add).toHaveBeenCalledTimes(0);
  });

  it("performs bans on new sites", async () => {
    const bannedOnSiteB = createUserFixture({
      tenantID,
      status: {
        ban: {
          siteIDs: [siteB.id],
        },
      },
    });

    userService.retrieveUser.mockResolvedValue(bannedOnSiteB);
    userService.siteBanUser.mockResolvedValue(bannedOnSiteB);

    const res = await updateUserBan(
      mongo,
      mailer,
      rejector,
      tenant,
      admin,
      bannedOnSiteB.id,
      "TEST MESSAGE",
      true,
      [siteA.id]
    );

    expect(res.id).toEqual(bannedOnSiteB.id);
    expect(userService.siteBanUser).toHaveBeenCalledTimes(1);
    expect(mailer.add).toHaveBeenCalledTimes(1);
    expect(rejector.add).toHaveBeenCalledTimes(1);
  });

  it("skips currently unbanned sites", async () => {
    const notBannedUser = createUserFixture({
      tenantID,
    });

    userService.retrieveUser.mockResolvedValue(notBannedUser);

    const res = await updateUserBan(
      mongo,
      mailer,
      rejector,
      tenant,
      admin,
      notBannedUser.id,
      "TEST MESSAGE",
      false,
      [],
      [siteA.id, siteB.id]
    );

    expect(res.id).toEqual(notBannedUser.id);
    expect(userService.removeUserSiteBan).toHaveBeenCalledTimes(0);
  });

  it("observes rejectExistingComments argument", async () => {
    const unbannedUser = createUserFixture({
      tenantID,
    });

    userService.retrieveUser.mockResolvedValue(unbannedUser);
    userService.siteBanUser.mockResolvedValue(unbannedUser);

    const dontRejectRes = await updateUserBan(
      mongo,
      mailer,
      rejector,
      tenant,
      admin,
      unbannedUser.id,
      "Test Message",
      false,
      [siteA.id, siteB.id]
    );

    expect(dontRejectRes.id).toEqual(unbannedUser.id);
    expect(rejector.add).toHaveBeenCalledTimes(0);

    const rejectRes = await updateUserBan(
      mongo,
      mailer,
      rejector,
      tenant,
      admin,
      unbannedUser.id,
      "Test Message",
      true,
      [siteA.id, siteB.id]
    );

    expect(rejectRes.id).toEqual(unbannedUser.id);
    expect(rejector.add).toHaveBeenCalledTimes(1);
  });
});

describe("updateRole", () => {
  afterEach(jest.clearAllMocks);

  const mongo = createMockMongoContex();
  const tenant = createTenantFixture();
  const tenantID = tenant.id;

  const commenterA = createUserFixture({
    tenantID,
    role: GQLUSER_ROLE.COMMENTER,
  });

  it("doesn't allow users to update their own roles", async () => {
    await expect(async () => {
      await updateRole(
        mongo,
        tenant,
        commenterA,
        commenterA.id,
        GQLUSER_ROLE.MODERATOR
      );
    }).rejects.toThrow(Error);
  });

  // TODO (marcushaddon): here for if we open role update to < admin
  it.skip("doesn't allow non-admins to udpate roles", async () => {
    const { COMMENTER, MEMBER, MODERATOR, STAFF, ADMIN } = GQLUSER_ROLE;

    for (const promoterRole of [COMMENTER, MEMBER, MODERATOR, STAFF]) {
      for (const promotionRole of [MEMBER, MODERATOR, STAFF, ADMIN]) {
        await expect(async () => {
          await updateRole(
            mongo,
            tenant,
            createUserFixture({ role: promoterRole, tenantID }),
            commenterA.id,
            promotionRole
          );
        }).rejects.toThrow();
      }
    }
  });
});
