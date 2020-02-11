import { pureMerge } from "coral-common/utils";
import {
  GQLCOMMENT_STATUS,
  GQLResolver,
  MutationToApproveCommentResolver,
} from "coral-framework/schema";
import {
  createMutationResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  toJSON,
  waitForElement,
  waitUntilThrow,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  rejectedComments,
  reportedComments,
  settings,
  site,
  siteConnection,
  users,
} from "../fixtures";

const viewer = users.admins[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/moderate");
});

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context, subscriptionHandler } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
          moderationQueues: () => emptyModerationQueues,
          comments: () => emptyRejectedComments,
          site: () => site,
          sites: () => siteConnection,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(true, "loggedIn");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  return { testRenderer, context, subscriptionHandler };
}

beforeEach(() => {
  replaceHistoryLocation(`http://localhost/admin/moderate/rejected`);
});

it("renders rejected queue with comments", async () => {
  const { testRenderer } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        comments: ({ variables }) => {
          expectAndFail(variables).toEqual({
            first: 5,
            status: "REJECTED",
            storyID: null,
          });
          return {
            edges: [
              {
                node: rejectedComments[0],
                cursor: rejectedComments[0].createdAt,
              },
              {
                node: rejectedComments[1],
                cursor: rejectedComments[1].createdAt,
              },
            ],
            pageInfo: {
              endCursor: rejectedComments[1].createdAt,
              hasNextPage: false,
            },
          };
        },
      },
    }),
  });
  const { getByTestID } = within(testRenderer.root);
  await waitForElement(() => getByTestID("moderate-container"));
  expect(toJSON(getByTestID("moderate-main-container"))).toMatchSnapshot();
});

it("shows a moderate story", async () => {
  const {
    testRenderer,
    context: { transitionControl },
  } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        comments: ({ variables }) => {
          expectAndFail(variables).toEqual({
            first: 5,
            status: "REJECTED",
            storyID: null,
          });
          return {
            edges: [
              {
                node: rejectedComments[0],
                cursor: rejectedComments[0].createdAt,
              },
              {
                node: rejectedComments[1],
                cursor: rejectedComments[1].createdAt,
              },
            ],
            pageInfo: {
              endCursor: rejectedComments[1].createdAt,
              hasNextPage: false,
            },
          };
        },
      },
    }),
  });
  const moderateStory = await waitForElement(
    () => within(testRenderer.root).getAllByText("Moderate Story")[0]
  );
  transitionControl.allowTransition = false;
  moderateStory.props.onClick({});
  // Expect a routing request was made to the right url.
  expect(transitionControl.history[0].pathname).toBe(
    `/admin/moderate/stories/${reportedComments[0].story.id}`
  );
});

it("renders rejected queue with comments and load more", async () => {
  const { testRenderer } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        comments: ({ variables, callCount }) => {
          switch (callCount) {
            case 0:
              expectAndFail(variables).toEqual({
                first: 5,
                status: GQLCOMMENT_STATUS.REJECTED,
                storyID: null,
              });
              return {
                edges: [
                  {
                    node: rejectedComments[0],
                    cursor: rejectedComments[0].createdAt,
                  },
                  {
                    node: rejectedComments[1],
                    cursor: rejectedComments[1].createdAt,
                  },
                ],
                pageInfo: {
                  endCursor: rejectedComments[1].createdAt,
                  hasNextPage: true,
                },
              };
            default:
              expectAndFail(variables).toEqual({
                first: 10,
                after: rejectedComments[1].createdAt,
                status: GQLCOMMENT_STATUS.REJECTED,
                storyID: null,
              });
              return {
                edges: [
                  {
                    node: rejectedComments[2],
                    cursor: rejectedComments[2].createdAt,
                  },
                ],
                pageInfo: {
                  endCursor: rejectedComments[2].createdAt,
                  hasNextPage: false,
                },
              };
          }
        },
      },
    }),
  });

  const moderateContainer = await waitForElement(() =>
    within(testRenderer.root).getByTestID("moderate-container")
  );

  const { getByText, getAllByTestID, getByTestID } = within(moderateContainer);

  // Get previous count of comments.
  const previousCount = getAllByTestID(/^moderate-comment-.*$/).length;

  const loadMore = await waitForElement(() => getByText("Load More"));
  loadMore.props.onClick();

  // Wait for load more to disappear.
  await waitUntilThrow(() => getByText("Load More"));

  // Verify we have one more item now.
  const comments = getAllByTestID(/^moderate-comment-.*$/);
  expect(comments.length).toBe(previousCount + 1);

  // Verify last one added was our new one
  expect(comments[comments.length - 1].props["data-testid"]).toBe(
    `moderate-comment-${rejectedComments[2].id}`
  );

  // Snapshot of added comment.
  expect(
    toJSON(getByTestID(`moderate-comment-${rejectedComments[2].id}`))
  ).toMatchSnapshot();
});

it("approves comment in rejected queue", async () => {
  const approveCommentStub = createMutationResolverStub<
    MutationToApproveCommentResolver
  >(({ variables }) => {
    expectAndFail(variables).toMatchObject({
      commentID: rejectedComments[0].id,
      commentRevisionID: rejectedComments[0].revision!.id,
    });
    return {
      comment: {
        id: rejectedComments[0].id,
        status: GQLCOMMENT_STATUS.APPROVED,
        statusHistory: {
          edges: [
            {
              node: {
                id: "mod-action",
                author: {
                  id: viewer.id,
                  username: viewer.username,
                },
              },
            },
          ],
        },
      },
      moderationQueues: pureMerge(emptyModerationQueues, {
        reported: {
          count: 1,
        },
      }),
    };
  });

  const { testRenderer } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        comments: ({ variables }) => {
          expectAndFail(variables).toEqual({
            first: 5,
            status: "REJECTED",
            storyID: null,
          });
          return {
            edges: [
              {
                node: rejectedComments[0],
                cursor: rejectedComments[0].createdAt,
              },
              {
                node: rejectedComments[1],
                cursor: rejectedComments[1].createdAt,
              },
            ],
            pageInfo: {
              endCursor: rejectedComments[1].createdAt,
              hasNextPage: false,
            },
          };
        },
      },
      Mutation: {
        approveComment: approveCommentStub,
      },
    }),
  });

  const testID = `moderate-comment-${rejectedComments[0].id}`;
  const { getByTestID } = within(testRenderer.root);
  const comment = await waitForElement(() => getByTestID(testID));

  const ApproveButton = await waitForElement(() =>
    within(comment).getByLabelText("Approve")
  );
  ApproveButton.props.onClick();

  // Snapshot dangling state of comment.
  expect(toJSON(getByTestID(testID))).toMatchSnapshot("dangling");

  // Wait until comment is gone.
  await waitUntilThrow(() => getByTestID(testID));

  expect(approveCommentStub.called).toBe(true);

  // Count should have been updated.
  expect(
    toJSON(getByTestID("moderate-navigation-reported-count"))
  ).toMatchSnapshot("count should be 1");
});
