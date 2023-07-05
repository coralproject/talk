import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { pureMerge } from "coral-common/utils";
import {
  GQLCOMMENT_SORT,
  GQLResolver,
  MutationToReviewCommentFlagResolver,
} from "coral-framework/schema";
import {
  createMutationResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
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
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => ({
            ...settings,
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
  customRenderAppWithContext(context);
  const modContainer = await screen.findByTestId("moderate-container");
  return { context, modContainer };
}

it("renders 'For Review' Navigation Item", async () => {
  await createTestRenderer();
  const tabBar = await screen.findByTestId("moderate-tabBar-container");
  expect(
    within(tabBar).getByRole("link", { name: "for review" })
  ).toBeVisible();
});

it("renders empty For Review queue", async () => {
  const { modContainer } = await createTestRenderer();
  // renders only the initial row with column names
  expect(within(modContainer).getAllByRole("row")).toHaveLength(1);
});

it("renders For Review queue with flags", async () => {
  const { modContainer } = await createTestRenderer({
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

  // confirm that renders all comment rows with expected flags
  const firstCommentRow = within(modContainer).getByRole("row", {
    name: "06/01/21, 02:21 PM This is the last random sentence I will Isabelle Abusive this is why",
  });
  expect(
    within(firstCommentRow).getByRole("cell", { name: "Abusive" })
  ).toBeVisible();
  expect(
    within(firstCommentRow).getByRole("cell", { name: "this is why" })
  ).toBeVisible();

  const secondCommentRow = within(modContainer).getByRole("row", {
    name: "06/01/21, 02:21 PM Don't fool with me Isabelle Abusive None",
  });
  expect(
    within(secondCommentRow).getByRole("cell", { name: "Abusive" })
  ).toBeVisible();
  expect(
    within(secondCommentRow).getByRole("cell", { name: "None" })
  ).toBeVisible();

  const thirdCommentRow = within(modContainer).getByRole("row", {
    name: "06/01/21, 02:21 PM Not available Isabelle Abusive Looks abusive",
  });
  expect(
    within(thirdCommentRow).getByRole("cell", { name: "Abusive" })
  ).toBeVisible();
  expect(
    within(thirdCommentRow).getByRole("cell", { name: "Looks abusive" })
  ).toBeVisible();

  const fourthCommentRow = within(modContainer).getByRole("row", {
    name: "06/01/21, 02:21 PM Don't fool with me Isabelle Abusive Looks abusive",
  });
  expect(
    within(fourthCommentRow).getByRole("cell", { name: "Abusive" })
  ).toBeVisible();
  expect(
    within(fourthCommentRow).getByRole("cell", { name: "Looks abusive" })
  ).toBeVisible();
});

it("load more", async () => {
  await createTestRenderer({
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

  // Get previous count of comments.
  const previousCount = screen.getAllByTestId(/^moderate-flag-.*$/).length;
  const loadMore = screen.getByRole("button", { name: "Load More" });
  userEvent.click(loadMore);

  // Wait for load more to disappear.
  await waitFor(() => {
    expect(loadMore).not.toBeInTheDocument();
  });

  // Verify we have one more item now.
  const flags = screen.getAllByTestId(/^moderate-flag-.*$/);
  expect(flags).toHaveLength(previousCount + 1);

  // Verify last one added was our new one
  expect(flags[flags.length - 1]).toHaveAttribute(
    "data-testid",
    `moderate-flag-${commentFlags[1].id}`
  );
});

it("mark as reviewed", async () => {
  const reviewCommentFlagStub =
    createMutationResolverStub<MutationToReviewCommentFlagResolver>(
      ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          id: commentFlags[0].id,
        });
        return {
          flag: {
            ...commentFlags[0],
            reviewed: true,
          },
        };
      }
    );
  const { modContainer } = await createTestRenderer({
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

  const markAsReviewedButton = within(modContainer).getByRole("button", {
    name: "Mark as reviewed",
  });
  userEvent.click(markAsReviewedButton);
  await within(modContainer).findByRole("button", { name: "Reviewed" });

  // Wait for flag to be marked as reviewed.
  expect(reviewCommentFlagStub.called).toBe(true);
});
