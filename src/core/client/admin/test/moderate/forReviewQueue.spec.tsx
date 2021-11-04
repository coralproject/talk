import { pureMerge } from "coral-common/utils";
import {
  GQLCOMMENT_SORT,
  GQLResolver,
  MutationToReviewCommentFlagResolver,
} from "coral-framework/schema";
import {
  act,
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
  commentFlags,
  commentFlagsDeleted,
  commentFlagsNoDetails,
  commentFlagsReviewed,
  emptyFlags,
  emptyModerationQueues,
  settings,
  site,
  siteConnection,
  users,
} from "../fixtures";

const viewer = users.admins[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/moderate/review");
});

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context, subscriptionHandler } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () =>
            pureMerge<typeof settings>(settings, {
              forReviewQueue: true,
            }),
          viewer: () => viewer,
          moderationQueues: () => emptyModerationQueues,
          flags: () => emptyFlags,
          site: () => site,
          sites: () => siteConnection,
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
  return { testRenderer, context, subscriptionHandler };
}

it("renders 'For Review' Navigation Item", async () => {
  const { testRenderer } = await createTestRenderer();
  const { getByTestID } = within(testRenderer.root);
  const tabBar = await waitForElement(() =>
    getByTestID("moderate-tabBar-container")
  );
  within(tabBar).getByText("For Review", { selector: "a", exact: false });
});

it("renders empty For Review queue", async () => {
  const { testRenderer } = await createTestRenderer();
  const { getByTestID } = within(testRenderer.root);
  await waitForElement(() => getByTestID("moderate-container"));
  expect(toJSON(getByTestID("moderate-main-container"))).toMatchSnapshot();
});

it("renders For Review queue with flags", async () => {
  const { testRenderer } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        flags: ({ variables }) => {
          expectAndFail(variables).toEqual({
            first: 15,
            storyID: null,
            siteID: null,
            section: null,
            orderBy: "CREATED_AT_DESC",
          });
          return {
            edges: [
              {
                node: commentFlags[0],
                cursor: commentFlags[0].createdAt,
              },
              {
                node: commentFlagsNoDetails[0],
                cursor: commentFlagsNoDetails[0].createdAt,
              },
              {
                node: commentFlagsDeleted[0],
                cursor: commentFlagsDeleted[0].createdAt,
              },
              {
                node: commentFlagsReviewed[0],
                cursor: commentFlagsReviewed[0].createdAt,
              },
            ],
            pageInfo: {
              endCursor: commentFlagsReviewed[0].createdAt,
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

it("load more", async () => {
  const { testRenderer } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        flags: ({ variables, callCount }) => {
          switch (callCount) {
            case 0:
              expectAndFail(variables).toEqual({
                first: 15,
                storyID: null,
                siteID: null,
                section: null,
                orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
              });
              return {
                edges: [
                  {
                    node: commentFlags[0],
                    cursor: commentFlags[0].createdAt,
                  },
                ],
                pageInfo: {
                  endCursor: commentFlags[0].createdAt,
                  hasNextPage: true,
                },
              };
            default:
              expectAndFail(variables).toMatchObject({
                first: 10,
                after: commentFlags[0].createdAt,
                storyID: null,
                siteID: null,
                section: null,
                orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
              });
              return {
                edges: [
                  {
                    node: commentFlags[1],
                    cursor: commentFlags[1].createdAt,
                  },
                ],
                pageInfo: {
                  endCursor: commentFlags[1].createdAt,
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

  const { getByText, getAllByTestID } = within(moderateContainer);

  // Get previous count of comments.
  const previousCount = getAllByTestID(/^moderate-flag-.*$/).length;

  const loadMore = await waitForElement(() => getByText("Load More"));

  act(() => {
    loadMore.props.onClick();
  });

  // Wait for load more to disappear.
  await waitUntilThrow(() => getByText("Load More"));

  // Verify we have one more item now.
  const flags = getAllByTestID(/^moderate-flag-.*$/);
  expect(flags.length).toBe(previousCount + 1);

  // Verify last one added was our new one
  expect(flags[flags.length - 1].props["data-testid"]).toBe(
    `moderate-flag-${commentFlags[1].id}`
  );
});

it("mark as reviewed", async () => {
  const reviewCommentFlagStub = createMutationResolverStub<
    MutationToReviewCommentFlagResolver
  >(({ variables }) => {
    expectAndFail(variables).toMatchObject({
      id: commentFlags[0].id,
    });
    return {
      flag: {
        ...commentFlags[0],
        reviewed: true,
      },
    };
  });
  const { testRenderer } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        flags: ({ variables }) => {
          expectAndFail(variables).toEqual({
            first: 15,
            storyID: null,
            siteID: null,
            section: null,
            orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
          });
          return {
            edges: [
              {
                node: commentFlags[0],
                cursor: commentFlags[0].createdAt,
              },
            ],
            pageInfo: {
              endCursor: commentFlags[0].createdAt,
              hasNextPage: false,
            },
          };
        },
      },
      Mutation: {
        reviewCommentFlag: reviewCommentFlagStub,
      },
    }),
  });

  const moderateContainer = await waitForElement(() =>
    within(testRenderer.root).getByTestID("moderate-container")
  );

  const markAsReviewedButton = within(moderateContainer).getByLabelText(
    "Mark as reviewed"
  );

  act(() => {
    markAsReviewedButton.props.onClick({});
  });

  // Wait for flag to be marked as reviewed.
  await waitForElement(() =>
    within(moderateContainer).getByLabelText("Reviewed")
  );
  expect(reviewCommentFlagStub.called).toBe(true);
});
