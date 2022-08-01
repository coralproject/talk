/* eslint-disable */
import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";
import {
  createUserFixture,
  createSiteFixture,
  createTenantFixture,
} from "../../test/fixtures";
import { createMockMongoContex } from "coral-server/test/mocks";
import { updateRole } from "./users";
import { seenComments } from "../mongodb/collections";

jest.mock("coral-server/models/user");


/**
 * Values:
 * - viewerRole: GQLUUSER_ROLEs
 * - userFromRole: GQLUSER_ROLEs
 * - userToRole: GQLUSER_ROLEs
 */

const ROLES = Object.values(GQLUSER_ROLE);
const tenant = createTenantFixture();
const tenantID = tenant.id;
const site1 = createSiteFixture({
  tenantID: tenant.id,
});
const admin = createUserFixture({
  role: GQLUSER_ROLE.ADMIN,
  tenantID,
});
const orgMod = createUserFixture({
  role: GQLUSER_ROLE.MODERATOR,
  tenantID,
});
const site1Mod = createUserFixture({
  tenantID,
  role: GQLUSER_ROLE.MODERATOR,
  moderationScopes: {
    siteIDs: [site1.id],
  },
});
const site1Staff = createUserFixture({
  tenantID,
  role: GQLUSER_ROLE.STAFF, // Hmm, the way we determine staff status in src/server/services/comment/pipeline/phases/tagStaff.ts seems to just tag site mods?
  moderationScopes: {
    siteIDs: [site1.id],
  },
});
const site1Member = createUserFixture({
  tenantID,
  role: GQLUSER_ROLE.MEMBER,
  membershipScopes: {
    siteIDs: [site1.id],
  },
});
const site1Commenter = createUserFixture({
  tenantID,
  role: GQLUSER_ROLE.COMMENTER,
});
const users = [
  admin,
  orgMod,
  site1Mod,
  site1Staff,
  site1Member,
  site1Commenter,
];

const inputStr = (
  viewerRole: GQLUSER_ROLE,
  userFromRole: GQLUSER_ROLE,
  userToRole: GQLUSER_ROLE,
) =>
  `viewer role = ${viewerRole}, user from role = ${userFromRole},  userToRole = ${userToRole}`;

describe("updateRole", () => {
  let mongoCtx: ReturnType<typeof createMockMongoContex>;

  /* eslint-disable-next-line */
  require("coral-server/models/user").retrieveUser.mockImplementation(
    async (_mongo: any, _tenantID: any, userID: string) => users.find(({ id }) => id === userID)
  );
  require("coral-server/models/user").updateUserRole.mockImplementation(
    async (_mongo: any, _tenantID: any, userID: string, role: GQLUSER_ROLE) => ({
      ...users.find(({ id }) => id === userID),
      role
    })
  );

  let uut: typeof updateRole;

  const exhaustiveInputs = new Map<string, boolean>();
  beforeAll(() => {
    uut = (
      mongo,
      tenant,
      viewer,
      userID,
      role,
    ) => {
      // TODO: improve this
      const inputHash = inputStr(
        users.find(({ id }) => id === viewer.id)!.role,
        users.find(({ id }) => id === userID)!.role,
        role,
      );
      exhaustiveInputs.set(inputHash, true);

      return updateRole(mongo, tenant, viewer, userID, role);
    }
    mongoCtx = createMockMongoContex();

    for (const viewer of users) {
      for (const user of users) {
        for (const newRole of ROLES) {
          const inputHash = inputStr(viewer.role, user.role, newRole);
          exhaustiveInputs.set(inputHash, false);
        }
      }
    }
  });

  it("allows admins to assign any user any role", async () => {
    const nonAdmins = users.filter(({ role }) => role !== GQLUSER_ROLE.ADMIN);
    for (const user of nonAdmins) {
      for (const role of ROLES) {
        const res = await uut(
          mongoCtx.ctx,
          tenant,
          admin,
          user.id,
          role,
        );

        expect(res.role).toEqual(role);
      }
    }
  });

  /**
   * IMPORTANT: this must be the last test in the suite!!!
   */
  it("saw all inputs", () => {
    const unseenInputs: string[] = [];
    for (const [inputHash, seen] of exhaustiveInputs.entries()) {
      if (!seen) {
        unseenInputs.push(inputHash);
      }
    }
    require("fs").writeFileSync(
      "temp.json",
      JSON.stringify(unseenInputs, null, 2)
    );
    expect(unseenInputs.length).toEqual(0);
    expect(unseenInputs).toEqual([]);
    if (unseenInputs.length > 0) {
      throw new Error(`
      User permissions not exhaustively tested. Did not see:
      ${unseenInputs.join("\n")}
      `);
    }
  });
});
