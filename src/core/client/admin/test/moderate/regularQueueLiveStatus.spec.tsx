import { pureMerge } from "coral-common/utils";
import {
  GQLCOMMENT_SORT,
  GQLCOMMENT_STATUS,
  GQLMODERATION_QUEUE,
  GQLResolver,
  ModerationQueueToCommentsResolver,
  SubscriptionToCommentLeftModerationQueueResolver,
} from "coral-framework/schema";
import {
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  reportedComments,
  settings,
  site,
  siteConnection,
  users,
} from "../fixtures";

const viewer = users.admins[0];
const commentData = reportedComments[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  replaceHistoryLocation(`http://localhost/admin/moderate/reported`);
  const { testRenderer, context, subscriptionHandler } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
          sites: () => siteConnection,
          site: () => site,
          moderationQueues: () =>
            pureMerge(emptyModerationQueues, {
              reported: {
                count: 1,
                comments:
                  createQueryResolverStub<ModerationQueueToCommentsResolver>(
                    ({ variables }) => {
                      expectAndFail(variables).toMatchObject({
                        first: 5,
                        orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
                      });
                      return {
                        edges: [
                          {
                            node: commentData,
                            cursor: commentData.createdAt,
                          },
                        ],
                        pageInfo: {
                          endCursor: commentData.createdAt,
                          hasNextPage: false,
                        },
                      };
                    }
                  ),
              },
            }),
          comments: () => emptyRejectedComments,
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
    within(testRenderer.root).getByTestID("moderate-main-container")
  );

  const comment = within(container).getByTestID(
    `moderate-comment-card-${commentData.id}`
  );

  return { testRenderer, context, container, comment, subscriptionHandler };
}

it("update comment status live", async () => {
  const { subscriptionHandler, comment } = await createTestRenderer();
  expect(subscriptionHandler.has("commentLeftModerationQueue")).toBe(true);
  expect(() =>
    within(comment).getByText("Moderated By", { exact: false })
  ).toThrow();

  subscriptionHandler.dispatch<SubscriptionToCommentLeftModerationQueueResolver>(
    "commentLeftModerationQueue",
    (variables) => {
      if (
        variables.storyID !== null ||
        variables.queue !== GQLMODERATION_QUEUE.REPORTED
      ) {
        return;
      }
      return {
        queue: GQLMODERATION_QUEUE.REPORTED,
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

  await waitForElement(() =>
    within(comment).getByText("Moderated By", { exact: false })
  );
});
