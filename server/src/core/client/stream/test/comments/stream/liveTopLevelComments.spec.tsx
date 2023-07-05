import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { pureMerge } from "coral-common/utils";
import {
  GQLResolver,
  SubscriptionToCommentEnteredResolver,
} from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";
import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";

import {
  comments,
  settings,
  stories,
  storyWithNoComments,
} from "../../fixtures";
import { createContext } from "../create";

const story = stories[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context, subscriptionHandler } = createContext({
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

  customRenderAppWithContext(context);
  const container = await screen.findByTestId("comments-allComments-log");

  return {
    context,
    container,
    subscriptionHandler,
  };
}
it("should view more when ordering by newest", async () => {
  const { container, subscriptionHandler } = await createTestRenderer();
  const commentData = comments[5];

  expect(subscriptionHandler.has("commentEntered")).toBe(true);
  expect(
    within(container).queryByTestId(`comment-${commentData.id}`)
  ).not.toBeInTheDocument();

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
  });

  const viewMoreButton = await screen.findByRole("button", {
    name: "View 1 New Comment",
  });
  await act(async () => {
    userEvent.click(viewMoreButton);
  });
  expect(
    within(container).getByTestId(`comment-${commentData.id}`)
  ).toBeVisible();
});

it("should load more when ordering by oldest", async () => {
  const { subscriptionHandler } = await createTestRenderer({
    initLocalState: (localRecord) => {
      localRecord.setValue("CREATED_AT_ASC", "commentsOrderBy");
    },
  });
  const commentData = comments[5];

  expect(subscriptionHandler.has("commentEntered")).toBe(true);
  expect(
    screen.queryByRole("button", { name: "Load More" })
  ).not.toBeInTheDocument();

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
  });

  expect(
    await screen.findByRole("button", { name: "Load More" })
  ).toBeVisible();
});

it("should load more when ordering by oldest even when initial render was empty", async () => {
  const { subscriptionHandler } = await createTestRenderer({
    resolvers: {
      Query: {
        story: () => storyWithNoComments,
      },
    },
    initLocalState: (localRecord) => {
      localRecord.setValue("CREATED_AT_ASC", "commentsOrderBy");
    },
  });
  expect(
    screen.queryByRole("button", { name: "Load More" })
  ).not.toBeInTheDocument();

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
  });
  expect(
    await screen.findByRole("button", { name: "Load More" })
  ).toBeVisible();
});

it("should not subscribe when story is closed", async () => {
  const { subscriptionHandler } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        stream: () => pureMerge<typeof story>(story, { isClosed: true }),
      },
    }),
  });
  expect(subscriptionHandler.has("commentEntered")).toBe(false);
});

it("should not subscribe when commenting is disabled", async () => {
  const { subscriptionHandler } = await createTestRenderer({
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
  expect(subscriptionHandler.has("commentEntered")).toBe(false);
});
