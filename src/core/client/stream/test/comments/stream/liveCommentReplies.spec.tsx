import { pureMerge } from "coral-common/utils";
import {
  GQLComment,
  GQLResolver,
  GQLStory,
  SubscriptionToCommentReplyCreatedResolver,
} from "coral-framework/schema";
import {
  createFixture,
  createResolversStub,
  CreateTestRendererParams,
  denormalizeComment,
  denormalizeStory,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { baseComment, baseStory, comments, settings } from "../../fixtures";
import create from "./create";

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

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context, subscriptionHandler } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          stream: () => story,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(story.id, "storyID");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });

  return {
    testRenderer,
    context,
    subscriptionHandler,
  };
}

it("should show more replies", async () => {
  const { testRenderer, subscriptionHandler } = await createTestRenderer();
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );
  expect(subscriptionHandler.has("commentReplyCreated")).toBe(true);
  expect(() =>
    within(container).getByTestID(`comment-${commentData.id}`)
  ).toThrow();

  subscriptionHandler.dispatch<SubscriptionToCommentReplyCreatedResolver>(
    "commentReplyCreated",
    variables => {
      if (variables.ancestorID !== rootComment.id) {
        return;
      }
      return {
        comment: pureMerge<typeof commentData>(commentData, {
          parent: { ...baseComment, id: "my-comment" },
        }),
      };
    }
  );

  const showMoreButton = await waitForElement(() =>
    within(testRenderer.root).getByText("Show More Replies", {
      exact: false,
      selector: "button",
    })
  );
  showMoreButton.props.onClick();
  within(container).getByTestID(`comment-${commentData.id}`);
});

it("should show Read More of this Conversation", async () => {
  const { testRenderer, subscriptionHandler } = await createTestRenderer();
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );
  expect(subscriptionHandler.has("commentReplyCreated")).toBe(true);
  expect(() =>
    within(testRenderer.root).getByText("Read More of this Conversation", {
      exact: false,
      selector: "a",
    })
  ).toThrow();

  subscriptionHandler.dispatch<SubscriptionToCommentReplyCreatedResolver>(
    "commentReplyCreated",
    variables => {
      if (variables.ancestorID !== rootComment.id) {
        return;
      }
      return {
        comment: pureMerge<typeof commentData>(commentData, {
          parent: { ...baseComment, id: "my-comment-3" },
        }),
      };
    }
  );
  within(container).getByText("Read More of this Conversation", {
    exact: false,
    selector: "a",
  });
});

it("should not subscribe when story is closed", async () => {
  const { testRenderer, subscriptionHandler } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        stream: () => pureMerge<typeof story>(story, { isClosed: true }),
      },
    }),
  });
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );
  expect(subscriptionHandler.has("commentReplyCreated")).toBe(false);
});

it("should not subscribe when commenting is disabled", async () => {
  const { testRenderer, subscriptionHandler } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        settings: () =>
          pureMerge<typeof settings>(settings, {
            disableCommenting: {
              enabled: true,
            },
          }),
      },
    }),
  });
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );
  expect(subscriptionHandler.has("commentReplyCreated")).toBe(false);
});
