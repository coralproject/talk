import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { pureMerge } from "coral-common/utils";
import {
  GQLComment,
  GQLResolver,
  GQLStory,
  SubscriptionToCommentEnteredResolver,
} from "coral-framework/schema";
import {
  createFixture,
  createResolversStub,
  CreateTestRendererParams,
  denormalizeComment,
  denormalizeStory,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";
import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";
import getCommentRecursively from "coral-stream/test/helpers/getCommentRecursively";
import { baseComment, baseStory, comments, settings } from "../../fixtures";
import { createContext } from "../create";
const commentData = comments[0];
const rootComment = denormalizeComment(
  createFixture<GQLComment>({
    ...baseComment,
    id: "my-comment",
    body: "body 0",
    replyCount: 1,
    replies: {
      ...baseComment.replies,
      edges: [
        {
          cursor: baseComment.createdAt,
          node: {
            ...baseComment,
            id: "my-comment-1",
            body: "body 1",
            replyCount: 1,
            replies: {
              ...baseComment.replies,
              edges: [
                {
                  cursor: baseComment.createdAt,
                  node: {
                    ...baseComment,
                    id: "my-comment-2",
                    body: "body 2",
                    replyCount: 1,
                    replies: {
                      ...baseComment.replies,
                      edges: [
                        {
                          cursor: baseComment.createdAt,
                          node: {
                            ...baseComment,
                            id: "my-comment-3",
                            body: "body 3",
                            replyCount: 0,
                            replies: {
                              ...baseComment.replies,
                              edges: [
                                {
                                  cursor: baseComment.createdAt,
                                  node: {
                                    ...baseComment,
                                    id: "my-comment-4",
                                    body: "body 4",
                                    replyCount: 1,
                                    replies: {
                                      ...baseComment.replies,
                                      edges: [
                                        {
                                          cursor: baseComment.createdAt,
                                          node: {
                                            ...baseComment,
                                            id: "my-comment-5",
                                            body: "body 5",
                                            replyCount: 1,
                                            replies: {
                                              ...baseComment.replies,
                                              edges: [
                                                {
                                                  cursor: baseComment.createdAt,
                                                  node: {
                                                    ...baseComment,
                                                    id: "my-comment-6",
                                                    body: "body 6",
                                                    replyCount: 0,
                                                    replies: {
                                                      ...baseComment.replies,
                                                      edges: [],
                                                    },
                                                  },
                                                },
                                              ],
                                            },
                                          },
                                        },
                                      ],
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  })
);
const story = denormalizeStory(
  createFixture<GQLStory>(
    {
      id: "story-with-deep-replies",
      url: "http://localhost/stories/story-with-replies",
      comments: {
        edges: [
          {
            node: rootComment,
            cursor: rootComment.createdAt,
          },
        ],
        pageInfo: {
          hasNextPage: false,
        },
      },
    },
    baseStory
  )
);
const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {}
) => {
  const { context, subscriptionHandler } = createContext({
    ...params,
    // ... base resolvers for this test suite
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
        },
      }),
      params.resolvers
    ),
    // ... init relevant local state (probs flatten replies)
  });

  customRenderAppWithContext(context);
  // ... query and await for any elements that you need to

  return { context, subscriptionHandler };
};

beforeEach(() => replaceHistoryLocation("http://localhost/admin/community"));
it("should show Read More of this Conversation", async () => {
  const { subscriptionHandler } = await createTestRenderer({
    resolvers: {
      Query: {
        stream: () => story,
      },
    },
    initLocalState(local) {
      local.setValue(false, "flattenReplies");
    },
  });
  const container = await screen.findByTestId("comments-allComments-log");
  expect(subscriptionHandler.has("commentEntered")).toBe(true);
  await expect(
    async () =>
      await within(container).findByText("Read More of this Conversation", {
        exact: false,
        selector: "a",
      })
  ).rejects.toThrow();
  act(() => {
    subscriptionHandler.dispatch<SubscriptionToCommentEnteredResolver>(
      "commentEntered",
      (variables) => {
        if (variables.storyID !== story.id) {
          return;
        }
        if (variables.ancestorID) {
          return;
        }
        return {
          comment: pureMerge<typeof commentData>(commentData, {
            parent: { ...baseComment, id: "my-comment-6" },
          }),
        };
      }
    );
  });

  await within(container).findByText("Read More of this Conversation", {
    exact: false,
    selector: "a",
  });
});

it("should flatten replies", async () => {
  const { subscriptionHandler } = await createTestRenderer({
    resolvers: {
      Query: {
        stream: () => story,
      },
    },
    initLocalState(local, source, environment) {
      local.setValue(true, "flattenReplies");
    },
  });
  const container = await screen.findByTestId("comments-allComments-log");
  expect(subscriptionHandler.has("commentEntered")).toBe(true);
  const showMoreReplies = await waitFor(async () => {
    /* Do stuff */
    // Dispatch new comment.
    subscriptionHandler.dispatch<SubscriptionToCommentEnteredResolver>(
      "commentEntered",
      (variables) => {
        if (variables.storyID !== story.id) {
          return;
        }
        if (variables.ancestorID) {
          return;
        }
        return {
          comment: pureMerge<typeof commentData>(comments[0], {
            parent: getCommentRecursively(rootComment.replies, "my-comment-6"),
          }),
        };
      }
    );
    // Dispatch new comment which is a reply to the comment above.
    subscriptionHandler.dispatch<SubscriptionToCommentEnteredResolver>(
      "commentEntered",
      (variables) => {
        if (variables.storyID !== story.id) {
          return;
        }
        if (variables.ancestorID) {
          return;
        }
        return {
          comment: pureMerge<typeof commentData>(comments[1], {
            parent: comments[0],
          }),
        };
      }
    );
    /* Wait for results */
    return await screen.findByText("Show More Replies", { selector: "button" });
  });
  expect(() =>
    within(container).getByText("Read More of this Conversation", {
      exact: false,
      selector: "a",
    })
  ).toThrow();
  fireEvent.click(showMoreReplies);
  await within(container).findByTestId(`comment-${comments[0].id}`);
  await within(container).findByTestId(`comment-${comments[1].id}`);
  // No reply lists after depth 4
  await expect(() =>
    within(container).findByTestId(`commentReplyList-${comments[0].id}`)
  ).rejects.toThrow();
});
