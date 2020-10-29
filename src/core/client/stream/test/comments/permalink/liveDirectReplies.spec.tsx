import { pureMerge } from "coral-common/utils";
import {
  GQLResolver,
  SubscriptionToCommentEnteredResolver,
} from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { comments, settings, stories } from "../../fixtures";
import create from "./create";

const story = stories[0];
const rootComment = comments[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context, subscriptionHandler } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          story: () => story,
          comment: () => comments[0],
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(story.id, "storyID");
      localRecord.setValue(rootComment.id, "commentID");
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

it("direct replies to the permalink comment should immediately appear", async () => {
  const liveComment = comments[3];
  const { testRenderer, subscriptionHandler } = await createTestRenderer();
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("current-tab-pane")
  );
  expect(subscriptionHandler.has("commentEntered")).toBe(true);

  expect(() =>
    within(container).getByTestID(`comment-${liveComment.id}`)
  ).toThrow();

  subscriptionHandler.dispatch<SubscriptionToCommentEnteredResolver>(
    "commentEntered",
    (variables) => {
      if (variables.storyID !== story.id) {
        return;
      }
      if (variables.ancestorID !== rootComment.id) {
        return;
      }
      return {
        comment: pureMerge<typeof liveComment>(liveComment, {
          parent: rootComment,
        }),
      };
    }
  );
  // Comment should immediately appear.
  within(container).getByTestID(`comment-${liveComment.id}`);
});
