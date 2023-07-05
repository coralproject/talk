import { pureMerge } from "coral-common/utils";
import {
  GQLCOMMENT_STATUS,
  GQLResolver,
  SubscriptionToCommentStatusUpdatedResolver,
} from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import { reportedComments, settings, users } from "../fixtures";

const viewer = users.admins[0];
const commentData = reportedComments[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/moderate");
});

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  replaceHistoryLocation(
    `http://localhost/admin/moderate/comment/${commentData.id}`
  );
  const { testRenderer, context, subscriptionHandler } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
          comment: () => commentData,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });

  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("single-moderate-container")
  );

  const comment = within(container).getByTestID(
    `moderate-comment-card-${commentData.id}`
  );

  return { testRenderer, context, container, comment, subscriptionHandler };
}

it("update comment status live", async () => {
  const { subscriptionHandler, comment } = await createTestRenderer();
  expect(subscriptionHandler.has("commentStatusUpdated")).toBe(true);
  expect(() =>
    within(comment).getByText("Moderated By", { exact: false })
  ).toThrow();

  subscriptionHandler.dispatch<SubscriptionToCommentStatusUpdatedResolver>(
    "commentStatusUpdated",
    (variables) => {
      if (variables.id !== commentData.id) {
        return;
      }
      return {
        newStatus: GQLCOMMENT_STATUS.APPROVED,
        comment: pureMerge<typeof commentData>(commentData, {
          status: GQLCOMMENT_STATUS.APPROVED,
          statusHistory: {
            edges: [
              {
                node: {
                  id: "mod-action-1",
                  moderator: users.moderators[0],
                  status: GQLCOMMENT_STATUS.APPROVED,
                },
              },
            ],
          },
        }),
      };
    }
  );

  // When status was changed by another user, the moderated by info should appear.
  await waitForElement(() =>
    within(comment).getByText("Moderated By", { exact: false })
  );
});
