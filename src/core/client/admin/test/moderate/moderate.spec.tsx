import { noop } from "lodash";
import { ReactTestInstance, ReactTestRenderer } from "react-test-renderer";

import { pureMerge } from "coral-common/utils";
import {
  GQLCOMMENT_STATUS,
  GQLResolver,
  ModerationQueueToCommentsResolver,
  MutationToApproveCommentResolver,
  MutationToRejectCommentResolver,
  QueryToCommentResolver,
} from "coral-framework/schema";
import {
  act,
  createMutationResolverStub,
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  findParentWithType,
  replaceHistoryLocation,
  toJSON,
  wait,
  waitForElement,
  waitUntilThrow,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  emptyStories,
  rejectedComments,
  reportedComments,
  settings,
  stories,
  storyConnection,
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

describe("search bar", () => {
  const openSearchBar = async (testRenderer: ReactTestRenderer) => {
    await act(async () => {
      await waitForElement(() =>
        within(testRenderer.root).getByTestID("moderate-searchBar-container")
      );
    });
    const searchBar = within(testRenderer.root).getByTestID(
      "moderate-searchBar-container"
    );
    const textField = within(searchBar).getByLabelText(
      "Search or jump to story..."
    );
    const form = findParentWithType(textField, "form")!;
    act(() => textField.props.onFocus({}));
    return { searchBar, textField, form };
  };

  describe("all stories", () => {
    it("renders search bar", async () => {
      let searchBar: ReactTestInstance;
      await act(async () => {
        const { testRenderer } = await createTestRenderer();
        searchBar = await waitForElement(() =>
          within(testRenderer.root).getByTestID("moderate-searchBar-container")
        );
      });
      expect(within(searchBar!).toJSON()).toMatchSnapshot();
    });

    describe("active", () => {
      it("search with no results", async () => {
        const query = "InterestingStory";
        const { testRenderer } = await createTestRenderer({
          resolvers: createResolversStub<GQLResolver>({
            Query: {
              stories: ({ variables }) => {
                expectAndFail(variables.query).toBe(query);
                return emptyStories;
              },
            },
          }),
        });
        const { searchBar, textField, form } = await openSearchBar(
          testRenderer
        );
        expect(within(searchBar).toJSON()).toMatchSnapshot();

        await act(async () => {
          // Search for sth.
          textField.props.onChange(query);
          form.props.onSubmit();

          // Ensure no results message is shown.
          await wait(() =>
            within(searchBar).getByText("No results", { exact: false })
          );
        });

        act(() => {
          // Blurring should close the listbox.
          textField.props.onBlur({});
        });
        expect(within(searchBar).queryByText("No results")).toBeNull();
      });
      it("search with actual results", async () => {
        const query = "InterestingStory";
        const {
          testRenderer,
          context: { transitionControl },
        } = await createTestRenderer({
          resolvers: createResolversStub<GQLResolver>({
            Query: {
              stories: ({ variables }) => {
                expectAndFail(variables.query).toBe(query);
                return storyConnection;
              },
            },
          }),
        });
        transitionControl.allowTransition = false;
        const { searchBar, textField, form } = await openSearchBar(
          testRenderer
        );

        const story = storyConnection.edges[0].node;

        let storyOption: ReactTestInstance;

        await act(async () => {
          // Search for sth.
          textField.props.onChange(query);
          form.props.onSubmit();

          // Find the story in the search results.
          storyOption = findParentWithType(
            await waitForElement(() =>
              within(searchBar).getByText(story.metadata!.title!, {
                exact: false,
              })
            ),
            "li"
          )!;
        });

        // Go to story.
        storyOption!.props.onClick({ button: 0, preventDefault: noop });

        // Expect a routing request was made to the right url.
        expect(transitionControl.history[0].pathname).toBe(
          `/admin/moderate/${story.id}`
        );
      });
      it("search with too many results", async () => {
        const query = "InterestingStory";
        const {
          testRenderer,
          context: { transitionControl },
        } = await createTestRenderer({
          resolvers: createResolversStub<GQLResolver>({
            Query: {
              stories: ({ variables }) => {
                expectAndFail(variables.query).toBe(query);
                return pureMerge<typeof storyConnection>(storyConnection, {
                  pageInfo: { hasNextPage: true },
                });
              },
            },
          }),
        });
        transitionControl.allowTransition = false;
        const { searchBar, textField, form } = await openSearchBar(
          testRenderer
        );

        let seeAllOption: ReactTestInstance;
        await act(async () => {
          // Search for sth.
          textField.props.onChange(query);
          form.props.onSubmit();

          // Find see all options in the search results.
          seeAllOption = findParentWithType(
            await waitForElement(() =>
              within(searchBar).getByText("See all results", { exact: false })
            ),
            "li"
          )!;
        });

        expect(within(seeAllOption!).toJSON()).toMatchSnapshot();

        // Go to story.
        seeAllOption!.props.onClick({ button: 0, preventDefault: noop });

        // Expect a routing request was made to the right url.
        expect(transitionControl.history[0].pathname).toBe("/admin/stories");
        expect(transitionControl.history[0].search).toBe(`?q=${query}`);
      });
    });
  });
  describe("specified story", () => {
    beforeEach(() => {
      replaceHistoryLocation(
        `http://localhost/admin/moderate/${stories[0].id}`
      );
    });
    it("renders search bar", async () => {
      await act(async () => {
        const { testRenderer } = await createTestRenderer({
          resolvers: createResolversStub<GQLResolver>({
            Query: {
              story: () => stories[0],
            },
          }),
        });
        const searchBar = await waitForElement(() =>
          within(testRenderer.root).getByTestID("moderate-searchBar-container")
        );
        const textField = within(searchBar).getByLabelText(
          "Search or jump to story..."
        );
        expect(textField.props.placeholder).toBe(stories[0].metadata!.title);
      });
    });
    it("shows moderate all option", async () => {
      const {
        testRenderer,
        context: { transitionControl },
      } = await createTestRenderer({
        resolvers: createResolversStub<GQLResolver>({
          Query: {
            story: () => stories[0],
          },
        }),
      });
      transitionControl.allowTransition = false;
      const { searchBar } = await openSearchBar(testRenderer);

      // Find see all options in the search results.
      const moderateAllOptions = findParentWithType(
        await waitForElement(() =>
          within(searchBar).getByText("Moderate all", { exact: false })
        ),
        "li"
      )!;

      // Activate moderate all.
      moderateAllOptions.props.onClick({ button: 0, preventDefault: noop });

      // Expect a routing request was made to the right url.
      expect(transitionControl.history[0].pathname).toBe("/admin/moderate");
    });
  });
});

describe("tab bar", () => {
  it("renders tab bar (empty queues)", async () => {
    await act(async () => {
      const { testRenderer } = await createTestRenderer();
      const { getByTestID } = within(testRenderer.root);
      await waitForElement(() => getByTestID("moderate-container"));
      expect(
        toJSON(getByTestID("moderate-tabBar-container"))
      ).toMatchSnapshot();
    });
  });
  it("should not show moderate story link in comment cards", async () => {
    await act(async () => {
      const { testRenderer } = await createTestRenderer();
      const { getByTestID } = within(testRenderer.root);
      await waitForElement(() => getByTestID("moderate-container"));
      expect(
        within(testRenderer.root).queryByText("Moderate Story")
      ).toBeNull();
    });
  });
});

describe("moderating specific story", () => {
  it("passes storyID to the endpoints", async () => {
    replaceHistoryLocation(`http://localhost/admin/moderate/${stories[0].id}`);
    await act(async () => {
      await createTestRenderer({
        resolvers: createResolversStub<GQLResolver>({
          Query: {
            moderationQueues: ({ variables }) => {
              expectAndFail(variables.storyID).toBe(stories[0].id);
              return emptyModerationQueues;
            },
            comments: ({ variables }) => {
              expectAndFail(variables.storyID).toBe(stories[0].id);
              return emptyRejectedComments;
            },
          },
        }),
      });
    });
  });
});

describe("reported queue", () => {
  it("renders empty reported queue", async () => {
    await act(async () => {
      const { testRenderer } = await createTestRenderer();
      const { getByText } = within(testRenderer.root);
      await waitForElement(() =>
        getByText("no more reported", { exact: false })
      );
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
                    expectAndFail(variables).toEqual({ first: 5 });
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
                    expectAndFail(variables).toEqual({ first: 5 });
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
                    expectAndFail(variables).toEqual({ first: 5 });
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
                    expectAndFail(variables).toEqual({ first: 5 });
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
      moderateStory.props.onClick({});
      // Expect a routing request was made to the right url.
      expect(transitionControl.history[0].pathname).toBe(
        `/admin/moderate/${reportedComments[0].story.id}`
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
                  expectAndFail(variables).toEqual({ first: 5 });
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
          commentRevisionID: reportedComments[0].revision.id,
        });
        return {
          comment: {
            id: reportedComments[0].id,
            status: GQLCOMMENT_STATUS.APPROVED,
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
              expectAndFail(variables).toEqual({ first: 5 });
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
      ApproveButton.props.onClick();

      // Snapshot dangling state of comment.
      expect(toJSON(comment)).toMatchSnapshot("dangling");

      // Wait until comment is gone.
      await waitUntilThrow(() => getByTestID(testID));

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
          commentRevisionID: reportedComments[0].revision.id,
        });
        return {
          comment: {
            id: reportedComments[0].id,
            status: GQLCOMMENT_STATUS.REJECTED,
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
                    expectAndFail(variables).toEqual({ first: 5 });
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
});

describe("rejected queue", () => {
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
      `/admin/moderate/${reportedComments[0].story.id}`
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
        commentRevisionID: rejectedComments[0].revision.id,
      });
      return {
        comment: {
          id: rejectedComments[0].id,
          status: GQLCOMMENT_STATUS.APPROVED,
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
});

describe("single comment view", () => {
  const comment = rejectedComments[0];
  const commentStub = createQueryResolverStub<QueryToCommentResolver>(
    ({ variables }) => {
      expectAndFail(variables).toEqual({ id: comment.id });
      return reportedComments[0];
    }
  );

  beforeEach(() => {
    replaceHistoryLocation(
      `http://localhost/admin/moderate/comment/${comment.id}`
    );
  });

  it("renders single comment view", async () => {
    const { testRenderer } = await createTestRenderer({
      resolvers: {
        Query: {
          comment: commentStub,
        },
      },
    });
    const { getByTestID } = within(testRenderer.root);
    const container = await waitForElement(() =>
      getByTestID("single-moderate-container")
    );
    expect(toJSON(container)).toMatchSnapshot();
  });

  it("approves single comment", async () => {
    const approveCommentStub = createMutationResolverStub<
      MutationToApproveCommentResolver
    >(({ variables }) => {
      expectAndFail(variables).toMatchObject({
        commentID: comment.id,
        commentRevisionID: comment.revision.id,
      });
      return {
        comment: {
          id: comment.id,
          status: GQLCOMMENT_STATUS.APPROVED,
        },
        moderationQueues: emptyModerationQueues,
      };
    });

    const { testRenderer } = await createTestRenderer({
      resolvers: {
        Query: {
          comment: commentStub,
        },
        Mutation: {
          approveComment: approveCommentStub,
        },
      },
    });

    const { getByLabelText, getByTestID } = within(testRenderer.root);
    const ApproveButton = await waitForElement(() => getByLabelText("Approve"));
    ApproveButton.props.onClick();

    expect(
      toJSON(getByTestID(`moderate-comment-${comment.id}`))
    ).toMatchSnapshot();

    expect(approveCommentStub.called).toBe(true);
  });

  it("rejects single comment", async () => {
    const rejectCommentStub = createMutationResolverStub<
      MutationToRejectCommentResolver
    >(({ variables }) => {
      expectAndFail(variables).toMatchObject({
        commentID: comment.id,
        commentRevisionID: comment.revision.id,
      });
      return {
        comment: {
          id: comment.id,
          status: GQLCOMMENT_STATUS.REJECTED,
        },
        moderationQueues: emptyModerationQueues,
      };
    });

    const { testRenderer } = await createTestRenderer({
      resolvers: {
        Query: {
          comment: commentStub,
        },
        Mutation: {
          rejectComment: rejectCommentStub,
        },
      },
    });

    const { getByLabelText, getByTestID } = within(testRenderer.root);
    const RejectButton = await waitForElement(() => getByLabelText("Reject"));
    RejectButton.props.onClick();

    expect(
      toJSON(getByTestID(`moderate-comment-${comment.id}`))
    ).toMatchSnapshot();
    expect(rejectCommentStub.called).toBe(true);
  });
});
