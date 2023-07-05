import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { pureMerge } from "coral-common/utils";
import {
  GQLCOMMENT_SORT,
  GQLCOMMENT_STATUS,
  GQLResolver,
  ModerationQueueToCommentsResolver,
  MutationToApproveCommentResolver,
  MutationToRejectCommentResolver,
} from "coral-framework/schema";
import {
  createMutationResolverStub,
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
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

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/moderate");
});

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          site: () => site,
          viewer: () => viewer,
          moderationQueues: () => emptyModerationQueues,
          comments: () => emptyRejectedComments,
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

  return { context };
}

it("renders moderate navigation with correct links and comment counts", async () => {
  await act(async () => {
    await createTestRenderer();
  });

  const pendingNav = await screen.findByText("Pending");
  expect(pendingNav).toBeDefined();
  expect(pendingNav.closest("a")).toHaveAttribute(
    "href",
    "/admin/moderate/pending"
  );
  expect(
    screen.getByTestId("moderate-navigation-pending-count")
  ).toHaveTextContent("0");

  const reportedNav = screen.getByText("reported");
  expect(reportedNav).toBeDefined();
  expect(reportedNav.closest("a")).toHaveAttribute(
    "href",
    "/admin/moderate/reported"
  );
  expect(
    screen.getByTestId("moderate-navigation-reported-count")
  ).toHaveTextContent("0");

  const unmoderatedNav = screen.getByText("unmoderated");
  expect(unmoderatedNav).toBeDefined();
  expect(unmoderatedNav.closest("a")).toHaveAttribute(
    "href",
    "/admin/moderate/unmoderated"
  );
  expect(
    screen.getByTestId("moderate-navigation-unmoderated-count")
  ).toHaveTextContent("0");

  const approvedNav = screen.getByText("approved");
  expect(approvedNav).toBeDefined();
  expect(approvedNav.closest("a")).toHaveAttribute(
    "href",
    "/admin/moderate/approved"
  );

  const rejectedNav = screen.getByText("rejected");
  expect(rejectedNav).toBeDefined();
  expect(rejectedNav.closest("a")).toHaveAttribute(
    "href",
    "/admin/moderate/rejected"
  );
});

it("renders empty reported queue", async () => {
  await createTestRenderer();
  const reportedQueue = await screen.findByText("no more reported", {
    exact: false,
  });
  expect(reportedQueue).toBeVisible();
});

it("renders empty pending queue", async () => {
  replaceHistoryLocation("http://localhost/admin/moderate/pending");
  await createTestRenderer();
  const pendingQueue = await screen.findByText("no more pending", {
    exact: false,
  });
  expect(pendingQueue).toBeVisible();
});

it("renders empty unmoderated queue", async () => {
  replaceHistoryLocation("http://localhost/admin/moderate/unmoderated");
  await createTestRenderer();
  const unmoderatedQueue = await screen.findByText(
    "comments have been moderated",
    {
      exact: false,
    }
  );
  expect(unmoderatedQueue).toBeVisible();
});

it("renders empty rejected queue", async () => {
  replaceHistoryLocation("http://localhost/admin/moderate/rejected");
  await createTestRenderer();
  const rejectedQueue = await screen.findByText("no rejected comments", {
    exact: false,
  });
  expect(rejectedQueue).toBeVisible();
});

it("renders reported queue with comments", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        moderationQueues: () =>
          pureMerge(emptyModerationQueues, {
            reported: {
              count: 2,
              comments:
                createQueryResolverStub<ModerationQueueToCommentsResolver>(
                  ({ variables }) => {
                    expectAndFail(variables).toEqual({
                      first: 5,
                      orderBy: "CREATED_AT_DESC",
                    });
                    return {
                      edges: [
                        {
                          node: reportedComments[0],
                          cursor: reportedComments[0].createdAt,
                        },
                        {
                          node: reportedComments[1],
                          cursor: reportedComments[1].createdAt,
                        },
                      ],
                      pageInfo: {
                        endCursor: reportedComments[1].createdAt,
                        hasNextPage: false,
                      },
                    };
                  }
                ) as any,
            },
          }),
      },
    }),
  });
  const moderateContainer = await screen.findByTestId("moderate-container");

  // make sure comment bodies are present
  expect(
    await within(moderateContainer).findByText(
      "This is the last random sentence I will be writing and I am going to stop mid-sent"
    )
  ).toBeVisible();
  expect(
    await within(moderateContainer).findByText("Don't fool with me")
  ).toBeVisible();
});

it("renders reported queue with comments correctly rendered", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        moderationQueues: () =>
          pureMerge(emptyModerationQueues, {
            reported: {
              count: 2,
              comments:
                createQueryResolverStub<ModerationQueueToCommentsResolver>(
                  ({ variables }) => {
                    expectAndFail(variables).toEqual({
                      first: 5,
                      orderBy: "CREATED_AT_DESC",
                    });
                    return {
                      edges: [
                        {
                          node: reportedComments[0],
                          cursor: reportedComments[0].createdAt,
                        },
                        {
                          node: reportedComments[1],
                          cursor: reportedComments[1].createdAt,
                        },
                      ],
                      pageInfo: {
                        endCursor: reportedComments[1].createdAt,
                        hasNextPage: false,
                      },
                    };
                  }
                ),
            },
          }),
      },
    }),
  });
  const moderateContainer = await screen.findByTestId("moderate-container");

  // make sure comment bodies, authors, and whether they are replies are correctly rendered
  // first comment
  expect(
    await within(moderateContainer).findByText(
      "This is the last random sentence I will be writing and I am going to stop mid-sent"
    )
  ).toBeVisible();
  expect(within(moderateContainer).getByText("Isabelle")).toBeVisible();

  // second comment
  expect(
    await within(moderateContainer).findByText("Don't fool with me")
  ).toBeVisible();
  expect(within(moderateContainer).getByText("Reply to")).toBeVisible();
  expect(within(moderateContainer).getByText("Ngoc")).toBeVisible();
});

it("renders reported queue with comments with banned words correctly", async () => {
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          moderationQueues: () =>
            pureMerge(emptyModerationQueues, {
              reported: {
                count: 2,
                comments:
                  createQueryResolverStub<ModerationQueueToCommentsResolver>(
                    ({ variables }) => {
                      expectAndFail(variables).toEqual({
                        first: 5,
                        orderBy: "CREATED_AT_DESC",
                      });
                      return {
                        edges: [
                          {
                            node: reportedComments[4],
                            cursor: reportedComments[4].createdAt,
                          },
                        ],
                        pageInfo: {
                          endCursor: reportedComments[4].createdAt,
                          hasNextPage: false,
                        },
                      };
                    }
                  ),
              },
            }),
        },
      }),
    });
  });
  const moderateContainer = await screen.findByTestId("moderate-container");
  const comment = within(moderateContainer).getByTestId(
    "moderate-comment-card-comment-4"
  );
  const commentText = within(comment).getByText(
    "This is a very long comment with",
    {
      exact: false,
    }
  );
  expect(commentText).toBeDefined();
  expect(commentText).toHaveTextContent(
    "This is a very long comment with bad words. Let's try bad and bad. Now bad bad. Bad BAD bad."
  );
  // banned words should be highlighted in the comment text
  expect(commentText.innerHTML).toContain(
    "This is a very long comment with <mark>bad</mark> words. Let's try <mark>bad</mark> and <mark>bad</mark>. Now <mark>bad</mark> <mark>bad</mark>.\nBad BAD <mark>bad</mark>.\n"
  );
});

it("show details of comment with flags", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        moderationQueues: () =>
          pureMerge(emptyModerationQueues, {
            reported: {
              count: 1,
              comments:
                createQueryResolverStub<ModerationQueueToCommentsResolver>(
                  ({ variables }) => {
                    expectAndFail(variables).toEqual({
                      first: 5,
                      orderBy: "CREATED_AT_DESC",
                    });
                    return {
                      edges: [
                        {
                          node: reportedComments[0],
                          cursor: reportedComments[0].createdAt,
                        },
                      ],
                      pageInfo: {
                        endCursor: reportedComments[0].createdAt,
                        hasNextPage: false,
                      },
                    };
                  }
                ),
            },
          }),
      },
    }),
  });
  const reported = await screen.findByTestId(
    `moderate-comment-card-${reportedComments[0].id}`
  );

  // all markers should be rendered for comment's flags
  expect(within(reported).getByText("Spam")).toBeVisible();
  expect(within(reported).getByText("Link")).toBeVisible();
  expect(within(reported).getByText("Banned word")).toBeVisible();
  expect(within(reported).getByText("Suspect word")).toBeVisible();
  expect(within(reported).getByText("Spam detected")).toBeVisible();
  expect(within(reported).getByText("Toxic")).toBeVisible();
  expect(within(reported).getByText("Repeat comment")).toBeVisible();
  expect(within(reported).getByText("Recent history")).toBeVisible();
  expect(within(reported).getByText("Offensive")).toBeVisible();
  expect(
    within(reported).queryByText(
      reportedComments[0].flags.nodes[0].additionalDetails!
    )
  ).toBeNull();
  const detailsButton = within(reported).getByRole("button", {
    name: "Details",
  });
  userEvent.click(detailsButton);
  expect(
    within(reported).getByText(
      reportedComments[0].flags.nodes[0].additionalDetails!
    )
  ).toBeVisible();
});

it("show reaction details for a comment with reactions", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        comment: ({ variables, callCount }) => {
          switch (callCount) {
            case 0:
              expectAndFail(variables).toMatchObject({ id: "comment-0" });
              return reportedComments[0];
            default:
              return reportedComments[0];
          }
        },
        user: ({ variables, callCount }) => {
          switch (callCount) {
            case 0:
              expectAndFail(variables).toMatchObject({
                id: "user-commenter-1",
              });
              return users.commenters[1];
            default:
              return users.commenters[1];
          }
        },
        moderationQueues: () =>
          pureMerge(emptyModerationQueues, {
            reported: {
              count: 1,
              comments: {
                edges: [
                  {
                    node: reportedComments[0],
                    cursor: reportedComments[0].createdAt,
                  },
                ],
                pageInfo: {
                  endCursor: reportedComments[0].createdAt,
                  hasNextPage: false,
                },
              },
            },
          }),
      },
    }),
  });
  const reported = await screen.findByTestId(
    `moderate-comment-card-${reportedComments[0].id}`
  );
  const detailsButton = within(reported).getByRole("button", {
    name: "Details",
  });
  userEvent.click(detailsButton);
  const reactionsButton = within(reported).getByRole("tab", {
    name: "Tab: Reactions",
  });
  await act(async () => {
    userEvent.click(reactionsButton);
  });

  const ngocButton = await screen.findByRole("button", { name: "Ngoc" });
  await act(async () => {
    userEvent.click(ngocButton);
  });
  const modal = await screen.findByTestId("userHistoryDrawer-modal");
  expect(within(modal).getByText("Ngoc")).toBeVisible();
});

it("shows story info and navigates to a moderate story", async () => {
  const { context } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        moderationQueues: () =>
          pureMerge(emptyModerationQueues, {
            reported: {
              count: 2,
              comments:
                createQueryResolverStub<ModerationQueueToCommentsResolver>(
                  ({ variables }) => {
                    expectAndFail(variables).toEqual({
                      first: 5,
                      orderBy: "CREATED_AT_DESC",
                    });
                    return {
                      edges: [
                        {
                          node: reportedComments[0],
                          cursor: reportedComments[0].createdAt,
                        },
                        {
                          node: reportedComments[1],
                          cursor: reportedComments[1].createdAt,
                        },
                      ],
                      pageInfo: {
                        endCursor: reportedComments[1].createdAt,
                        hasNextPage: false,
                      },
                    };
                  }
                ) as any,
            },
          }),
      },
    }),
  });
  const comment = await screen.findByTestId("moderate-comment-card-comment-0");
  const storyInfo = within(comment).getByTestId("moderate-comment-storyInfo");
  expect(storyInfo).toHaveTextContent("Comment On:Finally a Cure for Cancer");

  const moderateStory = screen.getAllByRole("link", {
    name: "Moderate Story",
  })[0];
  context.transitionControl.allowTransition = false;
  userEvent.click(moderateStory);

  // Expect a routing request was made to the right url. history[1] because a redirect happens through /admin/moderate
  expect(context.transitionControl.history[1].pathname).toBe(
    `/admin/moderate/stories/${reportedComments[0].story.id}`
  );
});

it("renders reported queue with comments and load more", async () => {
  const moderationQueuesStub = pureMerge(emptyModerationQueues, {
    reported: {
      count: 2,
      comments: createQueryResolverStub<ModerationQueueToCommentsResolver>(
        ({ variables, callCount }) => {
          switch (callCount) {
            case 0:
              expectAndFail(variables).toEqual({
                first: 5,
                orderBy: "CREATED_AT_DESC",
              });
              return {
                edges: [
                  {
                    node: reportedComments[0],
                    cursor: reportedComments[0].createdAt,
                  },
                  {
                    node: reportedComments[1],
                    cursor: reportedComments[1].createdAt,
                  },
                ],
                pageInfo: {
                  endCursor: reportedComments[1].createdAt,
                  hasNextPage: true,
                },
              };
            default:
              expectAndFail(variables).toEqual({
                first: 10,
                after: reportedComments[1].createdAt,
                orderBy: "CREATED_AT_DESC",
              });
              return {
                edges: [
                  {
                    node: reportedComments[2],
                    cursor: reportedComments[2].createdAt,
                  },
                ],
                pageInfo: {
                  endCursor: reportedComments[2].createdAt,
                  hasNextPage: false,
                },
              };
          }
        }
      ) as any,
    },
  });

  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        moderationQueues: () => moderationQueuesStub,
      },
    }),
  });
  const moderateContainer = await screen.findByTestId("moderate-container");

  // Get previous count of comments.
  const previousCount = (
    await within(moderateContainer).findAllByTestId(
      /^moderate-comment-card-.*$/
    )
  ).length;

  const loadMore = screen.getByRole("button", { name: "Load More" });
  userEvent.click(loadMore);

  // Wait for load more to disappear.
  await waitFor(() => {
    expect(screen.queryByRole("button", { name: "Load More" })).toBeNull();
  });

  // Verify we have one more item now.
  const comments = screen.getAllByTestId(/^moderate-comment-card-.*$/);
  expect(comments.length).toBe(previousCount + 1);

  // Verify last one added was our new one
  expect(comments[comments.length - 1]).toHaveAttribute(
    "data-testid",
    `moderate-comment-card-${reportedComments[2].id}`
  );
});

it("approves comment in reported queue", async () => {
  const approveCommentStub =
    createMutationResolverStub<MutationToApproveCommentResolver>(
      ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          commentID: reportedComments[0].id,
          commentRevisionID: reportedComments[0].revision!.id,
        });
        return {
          comment: {
            ...reportedComments[0],
            status: GQLCOMMENT_STATUS.APPROVED,
            statusHistory: {
              edges: [
                {
                  node: {
                    id: "mod-action",
                    status: GQLCOMMENT_STATUS.APPROVED,
                    moderator: {
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
      }
    );

  const moderationQueuesStub = pureMerge(emptyModerationQueues, {
    reported: {
      count: 2,
      comments: createQueryResolverStub<ModerationQueueToCommentsResolver>(
        ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            first: 5,
            orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
          });
          return {
            edges: [
              {
                node: reportedComments[0],
                cursor: reportedComments[0].createdAt,
              },
              {
                node: reportedComments[1],
                cursor: reportedComments[1].createdAt,
              },
            ],
            pageInfo: {
              endCursor: reportedComments[1].createdAt,
              hasNextPage: false,
            },
          };
        }
      ) as any,
    },
  });

  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        moderationQueues: () => moderationQueuesStub,
      },
      Mutation: {
        approveComment: approveCommentStub,
      },
    }),
  });

  const comment = await screen.findByTestId(
    `moderate-comment-card-${reportedComments[0].id}`
  );
  const approveButton = within(comment).getByRole("button", {
    name: "Approve",
  });
  userEvent.click(approveButton);

  // dangling state of comment.
  expect(
    within(comment).getByText(
      "This is the last random sentence I will be writing and I am going to stop mid-sent"
    )
  ).toBeVisible();

  // Wait until comment is gone.
  await waitFor(() => {
    expect(
      screen.queryByTestId(`moderate-comment-card-${reportedComments[0].id}`)
    ).toBeNull();
  });

  expect(approveCommentStub.called).toBe(true);

  // Count should have been updated.
  const reportedCount = screen.getByTestId(
    "moderate-navigation-reported-count"
  );
  expect(within(reportedCount).getByText("1")).toBeVisible();
});

it("rejects comment in reported queue", async () => {
  const rejectCommentStub =
    createMutationResolverStub<MutationToRejectCommentResolver>(
      ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          commentID: reportedComments[0].id,
          commentRevisionID: reportedComments[0].revision!.id,
        });
        return {
          comment: {
            ...reportedComments[0],
            status: GQLCOMMENT_STATUS.REJECTED,
            statusHistory: {
              edges: [
                {
                  node: {
                    id: "mod-action",
                    status: GQLCOMMENT_STATUS.REJECTED,
                    moderator: {
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
      }
    );

  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        moderationQueues: () =>
          pureMerge(emptyModerationQueues, {
            reported: {
              count: 2,
              comments:
                createQueryResolverStub<ModerationQueueToCommentsResolver>(
                  ({ variables }) => {
                    expectAndFail(variables).toEqual({
                      first: 5,
                      orderBy: "CREATED_AT_DESC",
                    });
                    return {
                      edges: [
                        {
                          node: reportedComments[0],
                          cursor: reportedComments[0].createdAt,
                        },
                        {
                          node: reportedComments[1],
                          cursor: reportedComments[1].createdAt,
                        },
                      ],
                      pageInfo: {
                        endCursor: reportedComments[1].createdAt,
                        hasNextPage: false,
                      },
                    };
                  }
                ) as any,
            },
          }),
      },
      Mutation: {
        rejectComment: rejectCommentStub,
      },
    }),
  });

  const comment = await screen.findByTestId(
    `moderate-comment-card-${reportedComments[0].id}`
  );
  const rejectButton = within(comment).getByRole("button", {
    name: "Reject",
  });
  userEvent.click(rejectButton);

  // dangling state of comment.
  expect(
    within(comment).getByText(
      "This is the last random sentence I will be writing and I am going to stop mid-sent"
    )
  ).toBeInTheDocument();

  // Wait until comment is gone.
  await waitFor(() => {
    expect(
      screen.queryByTestId(`moderate-comment-card-${reportedComments[0].id}`)
    ).toBeNull();
  });

  expect(rejectCommentStub.called).toBe(true);

  // Count should have been updated.
  const reportedCount = screen.getByTestId(
    "moderate-navigation-reported-count"
  );
  expect(within(reportedCount).getByText("1")).toBeVisible();
});
