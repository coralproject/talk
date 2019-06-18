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
  wait,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  settings,
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

it("live update count", async () => {
  const { testRenderer, subscriptionHandler } = await createTestRenderer();
  const verifyCount = (queue: GQLMODERATION_QUEUE, no: number) => {
    within(
      within(testRenderer.root).getByTestID(
        `moderate-navigation-${queue.toLocaleLowerCase()}-count`
      )
    ).getByText(no.toString());
  };
  const commentEntered = (queue: GQLMODERATION_QUEUE) => {
    subscriptionHandler.dispatch<
      SubscriptionToCommentEnteredModerationQueueResolver
    >("commentEnteredModerationQueue", variables => {
      if (variables.queue && variables.queue !== queue) {
        return;
      }
      return {
        queue,
      };
    });
  };
  const commentLeft = (queue: GQLMODERATION_QUEUE) => {
    subscriptionHandler.dispatch<
      SubscriptionToCommentEnteredModerationQueueResolver
    >("commentLeftModerationQueue", variables => {
      if (variables.queue && variables.queue !== queue) {
        return;
      }
      return {
        queue,
      };
    });
  };
  await act(async () => {
    await wait(() =>
      expect(subscriptionHandler.has("commentEnteredModerationQueue")).toBe(
        true
      )
    );
    verifyCount(GQLMODERATION_QUEUE.REPORTED, 0);
    verifyCount(GQLMODERATION_QUEUE.PENDING, 0);
    verifyCount(GQLMODERATION_QUEUE.UNMODERATED, 0);

    commentEntered(GQLMODERATION_QUEUE.REPORTED);

    verifyCount(GQLMODERATION_QUEUE.REPORTED, 1);
    verifyCount(GQLMODERATION_QUEUE.PENDING, 0);
    verifyCount(GQLMODERATION_QUEUE.UNMODERATED, 0);

    commentEntered(GQLMODERATION_QUEUE.REPORTED);

    verifyCount(GQLMODERATION_QUEUE.REPORTED, 2);
    verifyCount(GQLMODERATION_QUEUE.PENDING, 0);
    verifyCount(GQLMODERATION_QUEUE.UNMODERATED, 0);

    commentEntered(GQLMODERATION_QUEUE.PENDING);
    commentEntered(GQLMODERATION_QUEUE.PENDING);
    commentLeft(GQLMODERATION_QUEUE.REPORTED);

    verifyCount(GQLMODERATION_QUEUE.REPORTED, 1);
    verifyCount(GQLMODERATION_QUEUE.PENDING, 2);
    verifyCount(GQLMODERATION_QUEUE.UNMODERATED, 0);
  });
});
