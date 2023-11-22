import { Config } from "coral-server/config";
import {
  createCommentFixture,
  createStoryFixture,
  createTenantFixture,
  createUserFixture,
} from "coral-server/test/fixtures";
import {
  createMockMongoContex,
  createMockRedis,
} from "coral-server/test/mocks";
import moderate, { Moderate } from "./moderate";

import {
  GQLCOMMENT_STATUS,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";
import { I18n } from "coral-server/services/i18n";

jest.mock("coral-server/models/comment/comment");
jest.mock("coral-server/stacks/helpers");
jest.mock("coral-server/models/action/moderation/comment");

it("requires a valid rejection reason if dsaFeatures are enabled", async () => {
  const tenant = createTenantFixture({
    dsa: { enabled: true },
  });
  const config = {} as Config;
  const story = createStoryFixture({ tenantID: tenant.id });
  const comment = createCommentFixture({ storyID: story.id });
  const moderator = createUserFixture({
    tenantID: tenant.id,
    role: GQLUSER_ROLE.MODERATOR,
  });
  const { ctx: mongoContext } = createMockMongoContex();
  const redis = createMockRedis();

  /* eslint-disable-next-line */
  require("coral-server/models/comment/comment").retrieveComment.mockImplementation(
    async () => comment
  );

  /* eslint-disable-next-line */
  require("coral-server/models/comment/comment").updateCommentStatus.mockImplementation(
    async () => ({})
  );

  /* eslint-disable-next-line */
  require("coral-server/models/action/moderation/comment").createCommentModerationAction.mockImplementation(
    async () => ({})
  );

  /* eslint-disable-next-line */
  require("coral-server/stacks/helpers").updateAllCommentCounts.mockImplementation(
    async () => ({})
  );

  const input: Moderate = {
    commentID: comment.id,
    moderatorID: moderator.id,
    commentRevisionID: comment.revisions[comment.revisions.length - 1].id,
    status: GQLCOMMENT_STATUS.REJECTED,
  };

  await expect(
    async () =>
      await moderate(
        mongoContext,
        redis,
        config,
        new I18n("en-US"),
        tenant,
        input,
        new Date(),
        false,
        {
          actionCounts: {},
        }
      )
  ).rejects.toThrow();
});
