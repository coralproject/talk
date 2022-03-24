import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { pureMerge } from "coral-common/utils";
import {
  GQLCOMMENT_FLAG_REASON,
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
  return { context };
}

it("renders empty reported queue", async () => {
  await act(async () => {
    const { context } = await createTestRenderer();
    customRenderAppWithContext(context);
    const reportedQueue = await screen.findByText("no more reported", {
      exact: false,
    });
    expect(reportedQueue).toBeInTheDocument();
  });
});

it("renders empty pending queue", async () => {
  replaceHistoryLocation("http://localhost/admin/moderate/pending");
  const { context } = await createTestRenderer();
  customRenderAppWithContext(context);
  const pendingQueue = await screen.findByText("no more pending", {
    exact: false,
  });
  expect(pendingQueue).toBeInTheDocument();
});

it("renders empty unmoderated queue", async () => {
  replaceHistoryLocation("http://localhost/admin/moderate/unmoderated");
  const { context } = await createTestRenderer();
  customRenderAppWithContext(context);
  const unmoderatedQueue = await screen.findByText(
    "comments have been moderated",
    {
      exact: false,
    }
  );
  expect(unmoderatedQueue).toBeInTheDocument();
});

it("renders empty rejected queue", async () => {
  replaceHistoryLocation("http://localhost/admin/moderate/rejected");
  const { context } = await createTestRenderer();
  customRenderAppWithContext(context);
  const rejectedQueue = await screen.findByText("no rejected comments", {
    exact: false,
  });
  expect(rejectedQueue).toBeInTheDocument();
});

it("renders reported queue with comments", async () => {
  await act(async () => {
    const { context } = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          moderationQueues: () =>
            pureMerge(emptyModerationQueues, {
              reported: {
                count: 2,
                comments: createQueryResolverStub<
                  ModerationQueueToCommentsResolver
                >(({ variables }) => {
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
                }) as any,
              },
            }),
        },
      }),
    });
    customRenderAppWithContext(context);
    const moderateContainer = await screen.findByTestId("moderate-container");

    // make sure comment bodies are present
    expect(
      await within(moderateContainer).findByText(
        "This is the last random sentence I will be writing and I am going to stop mid-sent"
      )
    ).toBeInTheDocument();
    expect(
      await within(moderateContainer).findByText("Don't fool with me")
    ).toBeInTheDocument();
  });
});

it("renders reported queue with comments", async () => {
  await act(async () => {
    const { context } = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          moderationQueues: () =>
            pureMerge(emptyModerationQueues, {
              reported: {
                count: 2,
                comments: createQueryResolverStub<
                  ModerationQueueToCommentsResolver
                >(({ variables }) => {
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
                }),
              },
            }),
        },
      }),
    });
    customRenderAppWithContext(context);
    const moderateContainer = await screen.findByTestId("moderate-container");

    // make sure comment bodies are present
    expect(
      await within(moderateContainer).findByText(
        "This is the last random sentence I will be writing and I am going to stop mid-sent"
      )
    ).toBeInTheDocument();
    expect(
      await within(moderateContainer).findByText("Don't fool with me")
    ).toBeInTheDocument();
  });
});

it("show details of comment with flags and load more flags", async () => {
  await act(async () => {
    const { context } = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          moderationQueues: () =>
            pureMerge(emptyModerationQueues, {
              reported: {
                count: 1,
                comments: createQueryResolverStub<
                  ModerationQueueToCommentsResolver
                >(({ variables }) => {
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
                }),
              },
            }),
          comment: ({ variables }) => {
            expectAndFail(variables).toMatchObject({ id: "comment-0" });
            return pureMerge(reportedComments[0], {
              flags: {
                edges: [
                  {
                    node: {
                      id: "comment-0-flag-0",
                      reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
                      flagger: users.commenters[0],
                      additionalDetails: "This looks like an ad",
                    },
                    cursor: "2021-06-01T14:21:21.890Z",
                  },
                  {
                    node: {
                      id: "comment-0-flag-1",
                      reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
                      flagger: users.commenters[1],
                      additionalDetails: "",
                    },
                    cursor: "2021-06-01T14:21:21.890Z",
                  },
                  {
                    node: {
                      id: "comment-0-flag-2",
                      reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
                      flagger: users.commenters[1],
                      additionalDetails: "Another flag loaded",
                    },
                    cursor: "2021-06-01T14:21:21.890Z",
                  },
                ],
                pageInfo: { endCursor: null, hasNextPage: false },
                nodes: [
                  {
                    id: "comment-0-flag-0",
                    reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
                    flagger: users.commenters[0],
                    additionalDetails: "This looks like an ad",
                  },
                  {
                    id: "comment-0-flag-1",
                    reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
                    flagger: users.commenters[1],
                    additionalDetails: "",
                  },
                  {
                    node: {
                      id: "comment-0-flag-2",
                      reason: GQLCOMMENT_FLAG_REASON.COMMENT_REPORTED_SPAM,
                      flagger: users.commenters[1],
                      additionalDetails: "Another flag loaded",
                    },
                    cursor: "2021-06-01T14:21:21.890Z",
                  },
                ],
              },
            });
          },
        },
      }),
    });
    customRenderAppWithContext(context);
    const reported = await screen.findByTestId(
      `moderate-comment-${reportedComments[0].id}`
    );
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
    ).toBeInTheDocument();
    expect(screen.queryByText("Another flag loaded")).not.toBeInTheDocument();
    const loadMore = screen.getByRole("button", { name: "Load More" });
    userEvent.click(loadMore);
    expect(await screen.findByText("Another flag loaded")).toBeInTheDocument();
  });
});

it("show reaction details for a comment with reactions", async () => {
  await act(async () => {
    const { context } = await createTestRenderer({
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
    customRenderAppWithContext(context);
    const reported = await screen.findByTestId(
      `moderate-comment-${reportedComments[0].id}`
    );
    const detailsButton = within(reported).getByRole("button", {
      name: "Details",
    });
    userEvent.click(detailsButton);
    const reactionsButton = within(reported).getByRole("tab", {
      name: "Tab: Reactions",
    });
    userEvent.click(reactionsButton);
    const ngocButton = await screen.findByRole("button", { name: "Ngoc" });
    userEvent.click(ngocButton);
    const modal = await screen.findByTestId("userHistoryDrawer-modal");
    expect(within(modal).getByText("Ngoc")).toBeInTheDocument();
  });
});

it("shows a moderate story", async () => {
  await act(async () => {
    const { context } = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          moderationQueues: () =>
            pureMerge(emptyModerationQueues, {
              reported: {
                count: 2,
                comments: createQueryResolverStub<
                  ModerationQueueToCommentsResolver
                >(({ variables }) => {
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
                }) as any,
              },
            }),
        },
      }),
    });
    customRenderAppWithContext(context);
    const moderateStory = (
      await screen.findAllByRole("link", { name: "Moderate Story" })
    )[0];
    context.transitionControl.allowTransition = false;
    userEvent.click(moderateStory);

    // Expect a routing request was made to the right url. history[1] because a redirect happens through /admin/moderate
    expect(context.transitionControl.history[1].pathname).toBe(
      `/admin/moderate/stories/${reportedComments[0].story.id}`
    );
  });
});

it("renders reported queue with comments and load more", async () => {
  await act(async () => {
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

    const { context } = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          moderationQueues: () => moderationQueuesStub,
        },
      }),
    });
    customRenderAppWithContext(context);
    const moderateContainer = await screen.findByTestId("moderate-container");

    // Get previous count of comments.
    const previousCount = (
      await within(moderateContainer).findAllByTestId(/^moderate-comment-.*$/)
    ).length;

    const loadMore = screen.getByRole("button", { name: "Load More" });
    userEvent.click(loadMore);

    // Wait for load more to disappear.
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Load More" })).toBeNull();
    });

    // Verify we have one more item now.
    const comments = screen.getAllByTestId(/^moderate-comment-.*$/);
    expect(comments.length).toBe(previousCount + 1);

    // Verify last one added was our new one
    expect(comments[comments.length - 1]).toHaveAttribute(
      "data-testid",
      `moderate-comment-${reportedComments[2].id}`
    );
  });
});

it("approves comment in reported queue", async () => {
  await act(async () => {
    const approveCommentStub = createMutationResolverStub<
      MutationToApproveCommentResolver
    >(({ variables }) => {
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
    });

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

    const { context } = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          moderationQueues: () => moderationQueuesStub,
        },
        Mutation: {
          approveComment: approveCommentStub,
        },
      }),
    });
    customRenderAppWithContext(context);

    const comment = await screen.findByTestId(
      `moderate-comment-${reportedComments[0].id}`
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
    ).toBeInTheDocument();

    // Wait until comment is gone.
    await waitFor(() => {
      expect(
        screen.queryByTestId(`moderate-comment-${reportedComments[0].id}`)
      ).toBeNull();
    });

    expect(approveCommentStub.called).toBe(true);

    // Count should have been updated.
    const reportedCount = screen.getByTestId(
      "moderate-navigation-reported-count"
    );
    expect(within(reportedCount).getByText("1")).toBeInTheDocument();
  });
});

it("rejects comment in reported queue", async () => {
  await act(async () => {
    const rejectCommentStub = createMutationResolverStub<
      MutationToRejectCommentResolver
    >(({ variables }) => {
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
    });

    const { context } = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          moderationQueues: () =>
            pureMerge(emptyModerationQueues, {
              reported: {
                count: 2,
                comments: createQueryResolverStub<
                  ModerationQueueToCommentsResolver
                >(({ variables }) => {
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
                }) as any,
              },
            }),
        },
        Mutation: {
          rejectComment: rejectCommentStub,
        },
      }),
    });
    customRenderAppWithContext(context);

    const comment = await screen.findByTestId(
      `moderate-comment-${reportedComments[0].id}`
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
        screen.queryByTestId(`moderate-comment-${reportedComments[0].id}`)
      ).toBeNull();
    });

    expect(rejectCommentStub.called).toBe(true);

    // Count should have been updated.
    const reportedCount = screen.getByTestId(
      "moderate-navigation-reported-count"
    );
    expect(within(reportedCount).getByText("1")).toBeInTheDocument();
  });
});
