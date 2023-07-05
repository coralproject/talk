import RTE from "@coralproject/rte";
import { act } from "react-test-renderer";

import { pureMerge } from "coral-common/utils";
import {
  GQLComment,
  GQLResolver,
  GQLStory,
  SubscriptionToCommentEditedResolver,
} from "coral-framework/schema";
import {
  createFixture,
  createResolversStub,
  CreateTestRendererParams,
  denormalizeComment,
  denormalizeStory,
  findParentWithType,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { baseComment, baseStory, commenters, settings } from "../../fixtures";
import create from "./create";

const originalBody = "original body";
const editedBody = "modified body";

const rootComment = denormalizeComment(
  createFixture<GQLComment>({
    ...baseComment,
    id: "editing-comment",
    body: originalBody,
  })
);

const story = denormalizeStory(
  createFixture<GQLStory>(
    {
      id: "story-id",
      url: "http://localhost/stories/story-with-comments",
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
          viewer: () => commenters[0],
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

it("commentEdited subscription updates comment in stream", async () => {
  const { testRenderer, subscriptionHandler } = await createTestRenderer();
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );
  expect(subscriptionHandler.has("commentEdited")).toBe(true);

  // Check original comment body state
  const comment = await waitForElement(() =>
    within(container).getByTestID(`comment-${rootComment.id}`)
  );
  expect(() => {
    within(comment).getByText(originalBody);
  });

  // Edit the comment and publish subscription update
  subscriptionHandler.dispatch<SubscriptionToCommentEditedResolver>(
    "commentEdited",
    (variables) => {
      if (variables.storyID !== story.id) {
        return;
      }
      return {
        comment: pureMerge<typeof rootComment>(rootComment, {
          parent: {
            ...baseComment,
            id: "editing-comment",
            body: editedBody,
          },
        }),
      };
    }
  );

  // Check comment body has been updated
  expect(() => {
    within(comment).getByText(editedBody);
  });
  // Check comment has been marked edited
  expect(() => {
    within(comment).getByText("(Edited)");
  });
});

it("commentEdited subscription notifies replier that comment has changed", async () => {
  const { testRenderer, subscriptionHandler } = await createTestRenderer();
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );
  expect(subscriptionHandler.has("commentEdited")).toBe(true);

  // Check original comment body state
  const comment = await waitForElement(() =>
    within(container).getByTestID(`comment-${rootComment.id}`)
  );
  expect(() => {
    within(comment).getByText(originalBody);
  });

  // Open the reply form
  const replyButton = within(comment).getByTestID("comment-reply-button");
  void act(() => replyButton.props.onClick());

  // Make sure reply form is open
  await waitForElement(
    () =>
      findParentWithType(within(comment).getByLabelText("Write a reply"), RTE)!
  );

  // Edit the comment and publish subscription update
  subscriptionHandler.dispatch<SubscriptionToCommentEditedResolver>(
    "commentEdited",
    (variables) => {
      if (variables.storyID !== story.id) {
        return;
      }
      return {
        comment: pureMerge<typeof rootComment>(rootComment, {
          parent: {
            ...baseComment,
            id: "editing-comment",
            body: editedBody,
          },
        }),
      };
    }
  );

  // Check comment body has been updated
  expect(() => {
    within(comment).getByText(
      "This comment has just been edited. The latest version is displayed above."
    );
  });
});
