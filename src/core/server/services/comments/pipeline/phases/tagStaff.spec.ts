/* eslint-disable */
import { GQLTAG, GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";
import { Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import {
  createUserFixture,
  createStoryFixture,
  createTenantFixture,
  createSiteFixture
} from "coral-server/test/fixtures";
import { IntermediateModerationPhaseContext } from "..";
import { tagStaff } from "./tagStaff";

interface Case {
  user: User;
  story: Story;
  tenant: Tenant;
  expectedTag: GQLTAG | void;
  it: string;
}

/** testCase returns whether a comment would
 * be tagged for a given author, story, and tenant
 */
const testCase = (input: Case): GQLTAG | void => {
  const result = tagStaff(
    (input as unknown) as IntermediateModerationPhaseContext
  ) as any;

  if (result.tags?.length > 1) {
    throw new Error("tagStaff unexpectadly applied more than one tag");
  }

  return result.tags?.[0];
};

const tenant = createTenantFixture();
const tenantID = tenant.id;

const siteA = createSiteFixture({ tenantID });
const siteB = createSiteFixture({ tenantID });

const siteAStory = createStoryFixture(tenantID);
const siteBStory = createStoryFixture(tenantID);

const adminUser = createUserFixture({ tenantID });
adminUser.role = GQLUSER_ROLE.ADMIN;

const staffUser = createUserFixture({ tenantID });
staffUser.role = GQLUSER_ROLE.STAFF;

const orgModUser = createUserFixture({ tenantID });
orgModUser.role = GQLUSER_ROLE.MODERATOR;

const siteAModUser = createUserFixture({ tenantID });
siteAModUser.role = GQLUSER_ROLE.MODERATOR;
siteAModUser.moderationScopes = { siteIDs: [siteA.id] };

const siteBModUser = createUserFixture({ tenantID });
siteBModUser.role = GQLUSER_ROLE.MODERATOR;
siteBModUser.moderationScopes = { siteIDs: [siteB.id] };

const commenter = createUserFixture({ tenantID });

describe("tagStaff", () => {
  const cases: Case[] = [
    {
      it: "admin gets a badge on all sites (1)",
      user: adminUser,
      story: siteAStory,
      tenant,
      expectedTag: tenant.staff.adminLabel as GQLTAG,
    }
  ];
  for (const _case of cases) {
    it(_case.it, () => expect(testCase(_case)).toEqual(_case.expectedTag));
  }
});
