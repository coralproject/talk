import { pureMerge } from "coral-common/utils";
import {
  GQLMODERATION_QUEUE,
  GQLResolver,
  SubscriptionToCommentEnteredModerationQueueResolver,
} from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  reportedComments,
  settings,
  users,
} from "../fixtures";

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  replaceHistoryLocation(`http://localhost/admin/moderate/reported`);
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

  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("moderate-main-container")
  );

  return { testRenderer, context, container, subscriptionHandler };
}

it("allows viewing more when new comments come in", async () => {
  const { subscriptionHandler, container } = await createTestRenderer();
  const commentData = reportedComments[0];
  expect(subscriptionHandler.has("commentEnteredModerationQueue")).toBe(true);

  subscriptionHandler.dispatch<
    SubscriptionToCommentEnteredModerationQueueResolver
  >("commentEnteredModerationQueue", variables => {
    if (
      variables.storyID !== null ||
      variables.queue !== GQLMODERATION_QUEUE.REPORTED
    ) {
      return;
    }
    return {
      queue: GQLMODERATION_QUEUE.REPORTED,
      comment: commentData,
    };
  });

  const viewMoreButton = await waitForElement(() =>
    within(container).getByText("View 1 more", {
      exact: false,
      selector: "button",
    })
  );
  act(() => {
    viewMoreButton.props.onClick();
  });
  // View More Button should disappear.
  expect(() => within(container).getByText(/View \d+ more/)).toThrow();
  // New comment should appear.
  within(container).getByTestID(`moderate-comment-${commentData.id}`);
});
