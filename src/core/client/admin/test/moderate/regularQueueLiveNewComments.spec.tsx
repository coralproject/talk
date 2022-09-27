import { pureMerge } from "coral-common/utils";
import {
  GQLMODERATION_QUEUE,
  GQLResolver,
  SubscriptionToCommentEnteredModerationQueueResolver,
  SubscriptionToCommentLeftModerationQueueResolver,
} from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { createComment } from "coral-test/helpers/fixture";
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
          sites: () => siteConnection,
          site: () => site,
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

  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("moderate-main-container")
  );

  return { testRenderer, context, container, subscriptionHandler };
}

it("allows viewing new when new comments come in", async () => {
  const { subscriptionHandler, container } = await createTestRenderer();
  const commentData = reportedComments[0];
  expect(subscriptionHandler.has("commentEnteredModerationQueue")).toBe(true);

  subscriptionHandler.dispatch<SubscriptionToCommentEnteredModerationQueueResolver>(
    "commentEnteredModerationQueue",
    (variables) => {
      if (
        variables.storyID !== null ||
        variables.queue !== GQLMODERATION_QUEUE.REPORTED ||
        variables.orderBy !== "CREATED_AT_DESC"
      ) {
        return;
      }
      return {
        queue: GQLMODERATION_QUEUE.REPORTED,
        comment: commentData,
      };
    }
  );

  const viewNewButton = await waitForElement(() =>
    within(container).getByText("View 1 new", {
      exact: false,
      selector: "button",
    })
  );
  act(() => {
    viewNewButton.props.onClick();
  });
  // View New Button should disappear.
  expect(() => within(container).getByText(/View \d+ new/)).toThrow();
  // New comment should appear.
  within(container).getByTestID(`moderate-comment-card-${commentData.id}`);
});

it("limits view new comments to a fixed amount", async () => {
  const LIMIT = 20;
  const PUSH_AMOUNT = LIMIT + 10;
  const { subscriptionHandler, container } = await createTestRenderer();
  expect(subscriptionHandler.has("commentEnteredModerationQueue")).toBe(true);

  const pushNewComment = () => {
    subscriptionHandler.dispatch<SubscriptionToCommentEnteredModerationQueueResolver>(
      "commentEnteredModerationQueue",
      (variables) => {
        if (
          variables.storyID !== null ||
          variables.queue !== GQLMODERATION_QUEUE.REPORTED
        ) {
          return;
        }
        return {
          queue: GQLMODERATION_QUEUE.REPORTED,
          comment: createComment(),
        };
      }
    );
  };

  for (let i = 0; i < PUSH_AMOUNT; i++) {
    pushNewComment();
  }

  const viewNewButton = await waitForElement(() =>
    within(container).getByText(`View ${PUSH_AMOUNT}`, {
      exact: false,
      selector: "button",
    })
  );
  act(() => {
    viewNewButton.props.onClick();
  });
  // View New Button should disappear.
  expect(() => within(container).getByText(/View \d+ new/)).toThrow();
  // New comments should appear.
  /*
  TODO: (cvle) normally I would do this, but for some reason, 4 times the
  expected result is found.. is this because of <TransitionGroup /> thing? Hmm...

  const result = container.findAll((i) =>
      Boolean(i.props["data-testid"]?.startsWith("moderate-comment-"))
    ).length;
  */
  const result =
    within(container)
      .toHTML()
      .match(/data-testid="moderate-comment-card-/g)?.length || 0;
  expect(result).toBe(LIMIT);

  // There should also be a load more button.
  await waitForElement(() => within(container).getByText("Load More"));
});

it("recognizes when same comment enters and leaves again", async () => {
  const { subscriptionHandler, container } = await createTestRenderer();
  const commentData = reportedComments[0];
  expect(subscriptionHandler.has("commentEnteredModerationQueue")).toBe(true);

  subscriptionHandler.dispatch<SubscriptionToCommentEnteredModerationQueueResolver>(
    "commentEnteredModerationQueue",
    (variables) => {
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
    }
  );

  await waitForElement(() =>
    within(container).getByText(/View \d+ new/, {
      exact: false,
      selector: "button",
    })
  );

  subscriptionHandler.dispatch<SubscriptionToCommentLeftModerationQueueResolver>(
    "commentLeftModerationQueue",
    (variables) => {
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
    }
  );

  // View New Button should disappear.
  expect(() => within(container).getByText(/View \d+ new/)).toThrow();
});
