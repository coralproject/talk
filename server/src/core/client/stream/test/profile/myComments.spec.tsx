import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import sinon from "sinon";

import { DEFAULT_AUTO_ARCHIVE_OLDER_THAN } from "coral-common/constants";
import { createSinonStub } from "coral-framework/testHelpers";

import customRenderAppWithContext from "../customRenderAppWithContext";
import { comments, settings, stories, viewerWithComments } from "../fixtures";
import { createWithContext } from "./create";

interface Options {
  archivingEnabled: boolean;
}

const createTestRenderer = async (
  options: Options = { archivingEnabled: false }
) => {
  const meStub = {
    ...viewerWithComments,
    comments: createSinonStub(
      (s) => s.throws(),
      (s) =>
        s.withArgs({ first: 5, orderBy: "CREATED_AT_DESC" }).returns({
          edges: [
            {
              node: { ...comments[0], story: stories[0] },
              cursor: comments[0].createdAt,
            },
            {
              node: { ...comments[1], story: stories[0] },
              cursor: comments[1].createdAt,
            },
          ],
          pageInfo: {
            endCursor: comments[1].createdAt,
            hasNextPage: true,
          },
        }),
      (s) =>
        s
          .withArgs({
            first: 10,
            orderBy: "CREATED_AT_DESC",
            after: comments[1].createdAt,
          })
          .returns({
            edges: [
              {
                node: { ...comments[2], story: stories[0] },
                cursor: comments[2].createdAt,
              },
            ],
            pageInfo: {
              endCursor: comments[2].createdAt,
              hasNextPage: false,
            },
          })
    ),
  };

  const resolvers = {
    Query: {
      settings: sinon.stub().returns(settings),
      stream: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s
            .withArgs(undefined, { id: stories[0].id, url: null })
            .returns(stories[0])
      ),
      viewer: sinon.stub().returns(meStub),
    },
  };

  const { context } = createWithContext({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue("MY_COMMENTS", "profileTab");
      localRecord.setValue(stories[0].id, "storyID");
      localRecord.setValue(options.archivingEnabled, "archivingEnabled");
      localRecord.setValue(
        DEFAULT_AUTO_ARCHIVE_OLDER_THAN,
        "autoArchiveOlderThanMs"
      );
    },
  });

  customRenderAppWithContext(context);

  return;
};

it("renders profile with comment history", async () => {
  await act(async () => {
    await createTestRenderer();
  });
  const commentHistory = await screen.findByTestId("profile-commentHistory");

  expect(commentHistory).toBeVisible();

  // renders first comment with body, view conversation link, timestamp, etc.
  const commentOneHistory = screen.getByTestId("historyComment-comment-0");
  expect(commentOneHistory).toBeVisible();
  expect(within(commentOneHistory).getByText("Joining Too")).toBeVisible();
  expect(
    within(commentOneHistory).getByRole("link", { name: "View Conversation" })
  ).toBeVisible();
  expect(
    within(commentOneHistory).getByRole("button", {
      name: "2018-07-06T18:24:00.000Z",
    })
  ).toBeVisible();
  const commentOneOnStory = within(commentOneHistory).getByTestId(
    "profile-historyComment-comment-0-onStory"
  );
  expect(commentOneOnStory.textContent).toEqual(
    "Comment 2018-07-06T18:24:00.000Z on titleComment on:title"
  );

  // also renders second comment with body, view conversation link, timestamp, etc.
  const commentTwoHistory = screen.getByTestId("historyComment-comment-1");
  expect(commentTwoHistory).toBeVisible();
  expect(within(commentTwoHistory).getByText("What's up?")).toBeVisible();
  expect(
    within(commentTwoHistory).getByRole("link", { name: "View Conversation" })
  ).toBeVisible();
  expect(
    within(commentTwoHistory).getByRole("button", {
      name: "2018-07-06T18:24:00.000Z",
    })
  ).toBeVisible();
  const commentTwoOnStory = within(commentTwoHistory).getByTestId(
    "profile-historyComment-comment-1-onStory"
  );
  expect(commentTwoOnStory.textContent).toEqual(
    "Comment 2018-07-06T18:24:00.000Z on titleComment on:title"
  );
});

it("loads more comments", async () => {
  await createTestRenderer();
  const commentHistory = await screen.findByTestId("profile-commentHistory");

  // Get amount of comments before.
  const commentsBefore =
    within(commentHistory).getAllByTestId(/^historyComment-/).length;

  const loadMoreButton = within(commentHistory).getByRole("button", {
    name: "Load More",
  });
  userEvent.click(loadMoreButton);
  expect(loadMoreButton).toBeDisabled();

  // Wait for loading.
  await waitFor(() =>
    expect(
      within(commentHistory).queryByRole("button", { name: "Load More" })
    ).not.toBeInTheDocument()
  );
  expect(within(commentHistory).getAllByTestId(/^historyComment-/).length).toBe(
    commentsBefore + 1
  );
});

it("shows archived notification when archiving enabled", async () => {
  await createTestRenderer({
    archivingEnabled: true,
  });
  const commentHistory = await screen.findByTestId("profile-commentHistory");

  expect(
    within(commentHistory).getByText(
      "This is all of your comments from the previous",
      {
        exact: false,
      }
    )
  ).toBeDefined();
});

it("doesn't show archived notification when archiving disabled", async () => {
  await createTestRenderer({
    archivingEnabled: false,
  });
  const commentHistory = await screen.findByTestId("profile-commentHistory");

  expect(
    within(commentHistory).queryByText(
      "This is all of your comments from the previous",
      {
        exact: false,
      }
    )
  ).toBeNull();
});
