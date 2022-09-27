import {
  GQLTAG,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";
import { Story } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import {
  createSiteFixture,
  createStoryFixture,
  createTenantFixture,
  createUserFixture,
} from "coral-server/test/fixtures";
import { IntermediateModerationPhaseContext } from "..";
import { tagStaff } from "./tagStaff";

interface Case {
  author: User;
  story: Story;
  tenant: Tenant;
}

/**
 * testCase returns how a comment would
 * be tagged for a given author, story, and tenant
 */
const testCase = (input: Case): GQLTAG | void => {
  const result = tagStaff(
    input as unknown as IntermediateModerationPhaseContext
  ) as any;

  if (result?.tags?.length > 1) {
    throw new Error("tagStaff unexpectadly applied more than one tag");
  }

  return result?.tags?.[0];
};

const tenant = createTenantFixture();
const tenantID = tenant.id;

const tenantWithSiteModDisabled = createTenantFixture({
  id: tenantID,
  featureFlags: [],
});

const tenantWithSiteModEnabled = createTenantFixture({
  id: tenantID,
});

const siteA = createSiteFixture({ tenantID });
const siteB = createSiteFixture({ tenantID });

const siteAStory = createStoryFixture({ tenantID, siteID: siteA.id });
const siteBStory = createStoryFixture({ tenantID, siteID: siteB.id });

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

const commenter = createUserFixture({ tenantID, role: GQLUSER_ROLE.COMMENTER });

describe("tagStaff", () => {
  it("admin gets a badge on all sites", () => {
    expect(
      testCase({
        author: adminUser,
        story: siteAStory,
        tenant,
      })
    ).toEqual(GQLTAG.ADMIN);

    expect(
      testCase({
        author: adminUser,
        story: siteBStory,
        tenant,
      })
    ).toEqual(GQLTAG.ADMIN);
  });

  it("organization moderator gets badge on all sites", () => {
    expect(
      testCase({
        author: orgModUser,
        story: siteAStory,
        tenant: tenantWithSiteModDisabled,
      })
    ).toEqual(GQLTAG.MODERATOR);

    expect(
      testCase({
        author: orgModUser,
        story: siteBStory,
        tenant: tenantWithSiteModDisabled,
      })
    ).toEqual(GQLTAG.MODERATOR);

    expect(
      testCase({
        author: orgModUser,
        story: siteAStory,
        tenant: tenantWithSiteModEnabled,
      })
    ).toEqual(GQLTAG.MODERATOR);

    expect(
      testCase({
        author: orgModUser,
        story: siteBStory,
        tenant: tenantWithSiteModEnabled,
      })
    ).toEqual(GQLTAG.MODERATOR);
  });

  it("staff user gets staff badge on all sites", () => {
    expect(
      testCase({
        author: staffUser,
        story: siteAStory,
        tenant,
      })
    ).toEqual(GQLTAG.STAFF);

    expect(
      testCase({
        author: staffUser,
        story: siteBStory,
        tenant,
      })
    ).toEqual(GQLTAG.STAFF);
  });

  it("site moderators get moderator badge on assigned sites", () => {
    expect(
      testCase({
        author: siteAModUser,
        story: siteAStory,
        tenant: tenantWithSiteModEnabled,
      })
    ).toEqual(GQLTAG.MODERATOR);

    expect(
      testCase({
        author: siteBModUser,
        story: siteBStory,
        tenant: tenantWithSiteModEnabled,
      })
    ).toEqual(GQLTAG.MODERATOR);
  });

  it("site moderators do not get badge on non assigned sites", () => {
    expect(
      testCase({
        author: siteAModUser,
        story: siteBStory,
        tenant: tenantWithSiteModEnabled,
      })
    ).toBeUndefined();

    expect(
      testCase({
        author: siteBModUser,
        story: siteAStory,
        tenant: tenantWithSiteModEnabled,
      })
    ).toBeUndefined();
  });

  it("commenters do not get badges", () => {
    expect(
      testCase({
        author: commenter,
        story: siteAStory,
        tenant,
      })
    ).toBeUndefined();

    expect(
      testCase({
        author: commenter,
        story: siteBStory,
        tenant,
      })
    ).toBeUndefined();
  });
});
