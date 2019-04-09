import { get, merge } from "lodash";
import sinon from "sinon";

import {
  createSinonStub,
  replaceHistoryLocation,
  toJSON,
  waitForElement,
  waitUntilThrow,
  within,
} from "talk-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  rejectedComments,
  reportedComments,
  settings,
  users,
} from "../fixtures";

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/moderate");
});

const createTestRenderer = async (resolver: any = {}) => {
  const resolvers = {
    ...resolver,
    Query: {
      ...resolver.Query,
      settings: sinon
        .stub()
        .returns(merge({}, settings, get(resolver, "Query.settings"))),
      moderationQueues: sinon
        .stub()
        .returns(
          merge(
            {},
            emptyModerationQueues,
            get(resolver, "Query.moderationQueues")
          )
        ),
      comments:
        get(resolver, "Query.comments") ||
        sinon.stub().returns(emptyRejectedComments),
      viewer: sinon.stub().returns(users.admins[0]),
    },
  };
  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(true, "loggedIn");
    },
  });
  return testRenderer;
};

describe("navigation bar", () => {
  it("renders navigation bar (empty queues)", async () => {
    const testRenderer = await createTestRenderer();
    const { getByTestID } = within(testRenderer.root);
    await waitForElement(() => getByTestID("moderate-container"));
    expect(toJSON(getByTestID("moderate-subBar-container"))).toMatchSnapshot();
  });
});

describe("reported queue", () => {
  it("renders empty reported queue", async () => {
    const testRenderer = await createTestRenderer();
    const { getByTestID } = within(testRenderer.root);

    await waitForElement(() => getByTestID("moderate-container"));
    expect(toJSON(getByTestID("moderate-main-container"))).toMatchSnapshot();
  });

  it("renders reported queue with comments", async () => {
    const testRenderer = await createTestRenderer({
      Query: {
        moderationQueues: {
          reported: {
            count: 2,
            comments: sinon.stub().callsFake(data => {
              expectAndFail(data).toEqual({ first: 5 });
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
        },
      },
    });
    const { getByTestID } = within(testRenderer.root);
    await waitForElement(() => getByTestID("moderate-container"));
    expect(toJSON(getByTestID("moderate-main-container"))).toMatchSnapshot();
  });

  it("renders reported queue with comments and load more", async () => {
    const testRenderer = await createTestRenderer({
      Query: {
        moderationQueues: {
          reported: {
            count: 2,
            comments: createSinonStub(
              s =>
                s.onFirstCall().callsFake(data => {
                  expectAndFail(data).toEqual({ first: 5 });
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
                }),
              s =>
                s.onSecondCall().callsFake(data => {
                  expectAndFail(data).toEqual({
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
                })
            ),
          },
        },
      },
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

  it("accepts comment in reported queue", async () => {
    const acceptCommentStub = sinon.stub().callsFake((_, data) => {
      expectAndFail(data).toMatchObject({
        input: {
          commentID: reportedComments[0].id,
          commentRevisionID: reportedComments[0].revision.id,
        },
      });
      return {
        comment: {
          id: reportedComments[0].id,
          status: "ACCEPTED",
        },
        moderationQueues: merge({}, emptyModerationQueues, {
          reported: {
            count: 1,
          },
        }),
        clientMutationId: data.input.clientMutationId,
      };
    });

    const testRenderer = await createTestRenderer({
      Query: {
        moderationQueues: {
          reported: {
            count: 2,
            comments: sinon.stub().callsFake(data => {
              expectAndFail(data).toEqual({ first: 5 });
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
        },
      },
      Mutation: {
        acceptComment: acceptCommentStub,
      },
    });

    const testID = `moderate-comment-${reportedComments[0].id}`;
    const { getByTestID } = within(testRenderer.root);
    const comment = await waitForElement(() => getByTestID(testID));

    const AcceptButton = await waitForElement(() =>
      within(comment).getByLabelText("Accept")
    );
    AcceptButton.props.onClick();

    // Snapshot dangling state of comment.
    expect(toJSON(comment)).toMatchSnapshot("dangling");

    // Wait until comment is gone.
    await waitUntilThrow(() => getByTestID(testID));

    expect(acceptCommentStub.called).toBe(true);

    // Count should have been updated.
    expect(
      toJSON(getByTestID("moderate-navigation-reported-count"))
    ).toMatchSnapshot("count should be 1");
  });

  it("rejects comment in reported queue", async () => {
    const rejectCommentStub = sinon.stub().callsFake((_, data) => {
      expectAndFail(data).toMatchObject({
        input: {
          commentID: reportedComments[0].id,
          commentRevisionID: reportedComments[0].revision.id,
        },
      });
      return {
        comment: {
          id: reportedComments[0].id,
          status: "REJECTED",
        },
        moderationQueues: merge({}, emptyModerationQueues, {
          reported: {
            count: 1,
          },
        }),
        clientMutationId: data.input.clientMutationId,
      };
    });

    const testRenderer = await createTestRenderer({
      Query: {
        moderationQueues: {
          reported: {
            count: 2,
            comments: sinon.stub().callsFake(data => {
              expectAndFail(data).toEqual({ first: 5 });
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
        },
      },
      Mutation: {
        rejectComment: rejectCommentStub,
      },
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

describe("rejected queue", () => {
  beforeEach(() => {
    replaceHistoryLocation(`http://localhost/admin/moderate/rejected`);
  });

  it("renders rejected queue with comments", async () => {
    const testRenderer = await createTestRenderer({
      Query: {
        comments: sinon.stub().callsFake((_, data) => {
          expectAndFail(data).toEqual({
            first: 5,
            status: "REJECTED",
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
        }),
      },
    });
    const { getByTestID } = within(testRenderer.root);
    await waitForElement(() => getByTestID("moderate-container"));
    expect(toJSON(getByTestID("moderate-main-container"))).toMatchSnapshot();
  });

  it("renders rejected queue with comments and load more", async () => {
    const testRenderer = await createTestRenderer({
      Query: {
        comments: createSinonStub(
          s =>
            s.onFirstCall().callsFake((_, data) => {
              expectAndFail(data).toEqual({
                first: 5,
                status: "REJECTED",
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
            }),
          s =>
            s.onSecondCall().callsFake((_, data) => {
              expectAndFail(data).toEqual({
                first: 10,
                after: rejectedComments[1].createdAt,
                status: "REJECTED",
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
            })
        ),
      },
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

  it("accepts comment in rejected queue", async () => {
    const acceptCommentStub = sinon.stub().callsFake((_, data) => {
      expectAndFail(data).toMatchObject({
        input: {
          commentID: rejectedComments[0].id,
          commentRevisionID: rejectedComments[0].revision.id,
        },
      });
      return {
        comment: {
          id: rejectedComments[0].id,
          status: "ACCEPTED",
        },
        moderationQueues: merge({}, emptyModerationQueues, {
          reported: {
            count: 1,
          },
        }),
        clientMutationId: data.input.clientMutationId,
      };
    });

    const testRenderer = await createTestRenderer({
      Query: {
        comments: sinon.stub().callsFake((_, data) => {
          expectAndFail(data).toEqual({
            first: 5,
            status: "REJECTED",
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
        }),
      },
      Mutation: {
        acceptComment: acceptCommentStub,
      },
    });

    const testID = `moderate-comment-${rejectedComments[0].id}`;
    const { getByTestID } = within(testRenderer.root);
    const comment = await waitForElement(() => getByTestID(testID));

    const AcceptButton = await waitForElement(() =>
      within(comment).getByLabelText("Accept")
    );
    AcceptButton.props.onClick();

    // Snapshot dangling state of comment.
    expect(toJSON(getByTestID(testID))).toMatchSnapshot("dangling");

    // Wait until comment is gone.
    await waitUntilThrow(() => getByTestID(testID));

    expect(acceptCommentStub.called).toBe(true);

    // Count should have been updated.
    expect(
      toJSON(getByTestID("moderate-navigation-reported-count"))
    ).toMatchSnapshot("count should be 1");
  });
});

describe("single comment view", () => {
  const comment = rejectedComments[0];
  const commentStub = sinon.stub().callsFake((_, data) => {
    expectAndFail(data).toEqual({ id: comment.id });
    return reportedComments[0];
  });

  beforeEach(() => {
    replaceHistoryLocation(
      `http://localhost/admin/moderate/comment/${comment.id}`
    );
  });

  it("renders single comment view", async () => {
    const testRenderer = await createTestRenderer({
      Query: {
        comment: commentStub,
      },
    });
    const { getByTestID } = within(testRenderer.root);
    const container = await waitForElement(() =>
      getByTestID("single-moderate-container")
    );
    expect(toJSON(container)).toMatchSnapshot();
  });

  it("accepts single comment", async () => {
    const acceptCommentStub = sinon.stub().callsFake((_, data) => {
      expectAndFail(data).toMatchObject({
        input: {
          commentID: comment.id,
          commentRevisionID: comment.revision.id,
        },
      });
      return {
        comment: {
          id: comment.id,
          status: "ACCEPTED",
        },
        moderationQueues: emptyModerationQueues,
        clientMutationId: data.input.clientMutationId,
      };
    });

    const testRenderer = await createTestRenderer({
      Query: {
        comment: commentStub,
      },
      Mutation: {
        acceptComment: acceptCommentStub,
      },
    });

    const { getByLabelText, getByTestID } = within(testRenderer.root);
    const AcceptButton = await waitForElement(() => getByLabelText("Accept"));
    AcceptButton.props.onClick();

    expect(
      toJSON(getByTestID(`moderate-comment-${comment.id}`))
    ).toMatchSnapshot();

    expect(acceptCommentStub.called).toBe(true);
  });

  it("rejects single comment", async () => {
    const rejectCommentStub = sinon.stub().callsFake((_, data) => {
      expectAndFail(data).toMatchObject({
        input: {
          commentID: comment.id,
          commentRevisionID: comment.revision.id,
        },
      });
      return {
        comment: {
          id: comment.id,
          status: "REJECTED",
        },
        moderationQueues: emptyModerationQueues,
        clientMutationId: data.input.clientMutationId,
      };
    });

    const testRenderer = await createTestRenderer({
      Query: {
        comment: commentStub,
      },
      Mutation: {
        rejectComment: rejectCommentStub,
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
