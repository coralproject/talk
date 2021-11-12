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
  const mockRetrieveUser = jest.fn();
  jest.mock("coral-server/models/user", () => ({
    retrieveUser: mockRetrieveUser
  }))

  const mailer = createMockMailer();
  const rejector = createMockRejector();
  const mongo = createMockMongoContex();
  const tenant = createTenantFixture();
  const badUser = createUserFixture();
  const siteA = createSiteFixture({ tenantID: tenant.id });
  // const siteB = createSiteFixture({ tenantID: tenant.id });

  it("rejects actions by non mod users", async () => {
    const commentor = createUserFixture({ role: GQLUSER_ROLE.COMMENTER });
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
  })
});
