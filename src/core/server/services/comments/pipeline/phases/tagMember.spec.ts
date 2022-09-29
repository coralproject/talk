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
import { tagMember } from "./tagMember";

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
  const result = tagMember(
    input as unknown as IntermediateModerationPhaseContext
  ) as any;

  if (result?.tags?.length > 1) {
    throw new Error("tagMember unexpectadly applied more than one tag");
  }

  return result?.tags?.[0];
};

const tenant = createTenantFixture();
const tenantID = tenant.id;
const siteA = createSiteFixture({ tenantID });
const siteB = createSiteFixture({ tenantID });

const siteAStory = createStoryFixture({ tenantID, siteID: siteA.id });
const siteBStory = createStoryFixture({ tenantID, siteID: siteB.id });

const siteAMember = createUserFixture({
  tenantID,
  role: GQLUSER_ROLE.MEMBER,
  membershipScopes: { siteIDs: [siteA.id] },
});
const siteBMember = createUserFixture({
  tenantID,
  role: GQLUSER_ROLE.MEMBER,
  membershipScopes: { siteIDs: [siteB.id] },
});
const sitesABMember = createUserFixture({
  tenantID,
  role: GQLUSER_ROLE.MEMBER,
  membershipScopes: { siteIDs: [siteA.id, siteB.id] },
});

it("members get badges on sites within their scope", async () => {
  const userAonSiteA = testCase({
    author: siteAMember,
    story: siteAStory,
    tenant,
  });
  expect(userAonSiteA).toEqual(GQLTAG.MEMBER);

  const userBonSiteB = testCase({
    author: siteBMember,
    story: siteBStory,
    tenant,
  });
  expect(userBonSiteB).toEqual(GQLTAG.MEMBER);

  const userAonSiteB = testCase({
    author: siteAMember,
    story: siteBStory,
    tenant,
  });
  expect(userAonSiteB).toBeUndefined();

  const userBonSiteA = testCase({
    author: siteBMember,
    story: siteAStory,
    tenant,
  });
  expect(userBonSiteA).toBeUndefined();

  const bothMemberOnA = testCase({
    author: sitesABMember,
    story: siteAStory,
    tenant,
  });
  expect(bothMemberOnA).toEqual(GQLTAG.MEMBER);

  const bothMemberOnB = testCase({
    author: sitesABMember,
    story: siteBStory,
    tenant,
  });
  expect(bothMemberOnB).toEqual(GQLTAG.MEMBER);
});
