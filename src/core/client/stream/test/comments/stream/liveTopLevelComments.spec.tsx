import { pureMerge } from "coral-common/utils";
import {
  GQLResolver,
  SubscriptionToCommentEnteredResolver,
} from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import {
  comments,
  settings,
  stories,
  storyWithNoComments,
} from "../../fixtures";
import create from "./create";

const story = stories[0];

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
it("should view more when ordering by newest", async () => {
  const { testRenderer, subscriptionHandler } = await createTestRenderer();
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );
  const commentData = comments[5];

  expect(subscriptionHandler.has("commentEntered")).toBe(true);
  expect(() =>
    within(container).getByTestID(`comment-${commentData.id}`)
  ).toThrow();

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
        comment: commentData,
      };
    }
  );

  const viewMoreButton = await waitForElement(() =>
    within(testRenderer.root).getByText("View 1 New Comment", {
      exact: false,
      selector: "button",
    })
  );
  viewMoreButton.props.onClick();
  within(container).getByTestID(`comment-${commentData.id}`);
});

it("should load more when ordering by oldest", async () => {
  const { testRenderer, subscriptionHandler } = await createTestRenderer({
    initLocalState: (localRecord) => {
      localRecord.setValue("CREATED_AT_ASC", "commentsOrderBy");
    },
  });
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );
  const commentData = comments[5];

  expect(subscriptionHandler.has("commentEntered")).toBe(true);
  expect(() =>
    within(testRenderer.root).getByText("Load More", {
      exact: false,
      selector: "button",
    })
  ).toThrow();

  await act(async () => {
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
          comment: commentData,
        };
      }
    );

    await waitForElement(() =>
      within(testRenderer.root).getByText("Load More", {
        exact: false,
        selector: "button",
      })
    );
  });
});

it("should load more when ordering by oldest even when initial render was empty", async () => {
  const { testRenderer, subscriptionHandler } = await createTestRenderer({
    resolvers: {
      Query: {
        story: () => storyWithNoComments,
      },
    },
    initLocalState: (localRecord) => {
      localRecord.setValue("CREATED_AT_ASC", "commentsOrderBy");
    },
  });
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );
  expect(() =>
    within(testRenderer.root).getByText("Load More", {
      exact: false,
      selector: "button",
    })
  ).toThrow();

  const commentData = comments[5];
  await act(async () => {
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
          comment: commentData,
        };
      }
    );
    await waitForElement(() =>
      within(testRenderer.root).getByText("Load More", {
        exact: false,
        selector: "button",
      })
    );
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
  expect(subscriptionHandler.has("commentEntered")).toBe(false);
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
  expect(subscriptionHandler.has("commentEntered")).toBe(false);
});
