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
  act,
  createMutationResolverStub,
  createQueryResolverStub,
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
  return { testRenderer, context, subscriptionHandler };
}

it("renders empty reported queue", async () => {
  await act(async () => {
    const { testRenderer } = await createTestRenderer();
    const { getByText } = within(testRenderer.root);
    await waitForElement(() => getByText("no more reported", { exact: false }));
  });
});

it("renders empty pending queue", async () => {
  replaceHistoryLocation("http://localhost/admin/moderate/pending");
  const { testRenderer } = await createTestRenderer();
  const { getByText } = within(testRenderer.root);
  await waitForElement(() => getByText("no more pending", { exact: false }));
});

it("renders empty unmoderated queue", async () => {
  replaceHistoryLocation("http://localhost/admin/moderate/unmoderated");
  const { testRenderer } = await createTestRenderer();
  const { getByText } = within(testRenderer.root);
  await waitForElement(() =>
    getByText("comments have been moderated", { exact: false })
  );
});

it("renders empty rejected queue", async () => {
  replaceHistoryLocation("http://localhost/admin/moderate/rejected");
  const { testRenderer } = await createTestRenderer();
  const { getByText } = within(testRenderer.root);
  await waitForElement(() =>
    getByText("no rejected comments", { exact: false })
  );
});

it("renders reported queue with comments", async () => {
  await act(async () => {
    const { testRenderer } = await createTestRenderer({
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
    const { getByTestID } = within(testRenderer.root);
    await waitForElement(() => getByTestID("moderate-container"));
    expect(toJSON(getByTestID("moderate-main-container"))).toMatchSnapshot();
  });
});

it("renders reported queue with comments", async () => {
  await act(async () => {
    const { testRenderer } = await createTestRenderer({
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
    const { getByTestID } = within(testRenderer.root);
    await waitForElement(() => getByTestID("moderate-container"));
    expect(toJSON(getByTestID("moderate-main-container"))).toMatchSnapshot();
  });
});
it("show details of comment with flags", async () => {
  await act(async () => {
    const { testRenderer } = await createTestRenderer({
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
        },
      }),
    });
    const { getByTestID } = within(testRenderer.root);
    const reported = await waitForElement(() =>
      getByTestID(`moderate-comment-${reportedComments[0].id}`)
    );
    expect(
      within(reported).queryByText(
        reportedComments[0].flags.nodes[0].additionalDetails!
      )
    ).toBeNull();
    within(reported)
      .getByText("Details", { selector: "button" })
      .props.onClick();
    within(reported).getByText(
      reportedComments[0].flags.nodes[0].additionalDetails!
    );
  });
});

it("show reaction details for a comment with reactions", async () => {
  await act(async () => {
    const { testRenderer } = await createTestRenderer({
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
    const { getByTestID } = within(testRenderer.root);
    const reported = await waitForElement(() =>
      getByTestID(`moderate-comment-${reportedComments[0].id}`)
    );
    await act(async () => {
      within(reported)
        .getByText("Details", { selector: "button" })
        .props.onClick();
    });
    await act(async () => {
      within(reported)
        .getByText("Reactions", { selector: "button" })
        .props.onClick();
    });
    // Reacter's username is shown, and clicking their username
    // opens their user history drawer modal
    await act(async () => {
      within(testRenderer.root)
        .getByText("Ngoc", { selector: "button" })
        .props.onClick();
    });
    const modal = await waitForElement(() =>
      getByTestID("userHistoryDrawer-modal")
    );
    within(modal).getByText("Ngoc");
  });
});

it("shows a moderate story", async () => {
  await act(async () => {
    const {
      testRenderer,
      context: { transitionControl },
    } = await createTestRenderer({
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
    const moderateStory = await waitForElement(
      () => within(testRenderer.root).getAllByText("Moderate Story")[0]
    );
    transitionControl.allowTransition = false;
    await act(async () => {
      moderateStory.props.onClick({});
    });

    // Expect a routing request was made to the right url. history[1] because a redirect happens through /admin/moderate
    expect(transitionControl.history[1].pathname).toBe(
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

    const { testRenderer } = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          moderationQueues: () => moderationQueuesStub,
        },
      }),
    });
    const moderateContainer = await waitForElement(() =>
      within(testRenderer.root).getByTestID("moderate-container")
    );

    const { getByText, getAllByTestID, getByTestID } = within(
      moderateContainer
    );

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
      `moderate-comment-${reportedComments[2].id}`
    );

    // Snapshot of added comment.
    expect(
      toJSON(getByTestID(`moderate-comment-${reportedComments[2].id}`))
    ).toMatchSnapshot();
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

    const { testRenderer } = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          moderationQueues: () => moderationQueuesStub,
        },
        Mutation: {
          approveComment: approveCommentStub,
        },
      }),
    });

    const testID = `moderate-comment-${reportedComments[0].id}`;
    const { getByTestID } = within(testRenderer.root);
    const comment = await waitForElement(() => getByTestID(testID));

    const ApproveButton = await waitForElement(() =>
      within(comment).getByLabelText("Approve")
    );

    await act(async () => {
      ApproveButton.props.onClick();

      // Snapshot dangling state of comment.
      expect(toJSON(comment)).toMatchSnapshot("dangling");

      // Wait until comment is gone.
      await waitUntilThrow(() => getByTestID(testID));
    });

    expect(approveCommentStub.called).toBe(true);

    // Count should have been updated.
    expect(
      toJSON(getByTestID("moderate-navigation-reported-count"))
    ).toMatchSnapshot("count should be 1");
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

    const { testRenderer } = await createTestRenderer({
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

    const testID = `moderate-comment-${reportedComments[0].id}`;
    const { getByTestID } = within(testRenderer.root);
    const comment = await waitForElement(() => getByTestID(testID));

    const RejectButton = await waitForElement(() =>
      within(comment).getByLabelText("Reject")
    );
    RejectButton.props.onClick();

    // Snapshot dangling state of comment.
    expect(toJSON(comment)).toMatchSnapshot("dangling");

    // Wait until comment is gone.
    await waitUntilThrow(() => getByTestID(testID));

    expect(rejectCommentStub.called).toBe(true);

    // Count should have been updated.
    expect(
      toJSON(getByTestID("moderate-navigation-reported-count"))
    ).toMatchSnapshot("count should be 1");
  });
});
