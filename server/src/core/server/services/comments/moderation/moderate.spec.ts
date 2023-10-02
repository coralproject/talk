import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { AugmentedRedis } from "coral-server/services/redis";
import {
  createCommentFixture,
  createStoryFixture,
  createTenantFixture,
  createUserFixture,
} from "coral-server/test/fixtures";
import { createMockRedis } from "coral-server/test/mocks";
import moderate, { Moderate } from "./moderate";

import {
  GQLCOMMENT_STATUS,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";

jest.mock("coral-server/models/comment");
jest.mock("coral-server/stacks/helpers");
jest.mock("coral-server/models/action/moderation/comment");

it("requires a valid rejection reason if dsaFeatures are enabled", async () => {
  const tenant = createTenantFixture();
  const config = {} as Config;
  const story = createStoryFixture({ tenantID: tenant.id });
  const comment = createCommentFixture({ storyID: story.id });
  const moderator = createUserFixture({
    tenantID: tenant.id,
    role: GQLUSER_ROLE.MODERATOR,
  });
  let mongo: MongoContext;
  const redis = createMockRedis();

  /* eslint-disable-next-line */
  require("coral-server/models/comment").retrieveComment.mockImplementation(
    async () => "TODO"
  );

  /* eslint-disable-next-line */
  require("coral-server/models/comment").updateCommentStatus.mockImplementation(
    async () => "TODO"
  );

  /* eslint-disable-next-line */
  require("coral-server/models/action/moderation/comment").createCommentModerationAction.mockImplementation(
    async () => "TODO"
  );

  /* eslint-disable-next-line */
  require("coral-server/stacks/helpers").updateAllCommentCounts.mockImplementation(
    async () => "TODO"
  );

  const input: Moderate = {
    commentID: comment.id,
    moderatorID: moderator.id,
    commentRevisionID: comment.revisions[comment.revisions.length - 1].id,
    status: GQLCOMMENT_STATUS.REJECTED,
  };

  await expect(
    async () =>
      await moderate(mongo, redis, config, tenant, input, new Date(), false, {
        actionCounts: {}, // TODO: what should this be?
      })
  ).rejects.toThrow();
});
