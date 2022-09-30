import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import sinon from "sinon";

import { createSinonStub } from "coral-framework/testHelpers";
import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";

import { comments, settings, stories } from "../../fixtures";
import { createContext } from "../create";

async function createTestRenderer() {
  const commentStub = {
    ...comments[0],
    replies: createSinonStub(
      (s) => s.throws(),
      (s) =>
        s.withArgs({ first: 10, orderBy: "CREATED_AT_ASC" }).returns({
          edges: [
            {
              node: comments[1],
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
            first: sinon.match((n) => n > 10000),
            orderBy: "CREATED_AT_ASC",
            after: comments[1].createdAt,
          })
          .returns({
            edges: [
              {
                node: comments[2],
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

  const storyStub = {
    ...stories[0],
    comments: {
      pageInfo: {
        hasNextPage: false,
      },
      edges: [
        {
          node: commentStub,
          cursor: commentStub.createdAt,
        },
      ],
    },
  };

  const resolvers = {
    Query: {
      settings: sinon.stub().returns(settings),
      comment: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s.withArgs(undefined, { id: commentStub.id }).returns(commentStub)
      ),
      stream: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s
            .withArgs(undefined, { id: storyStub.id, url: null, mode: null })
            .returns(storyStub)
      ),
    },
  };

  const { context } = createContext({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(storyStub.id, "storyID");
    },
  });
  customRenderAppWithContext(context);
}

beforeEach(async () => {
  await act(async () => {
    await createTestRenderer();
  });
});

it("renders comment stream with comments", async () => {
  const commentID = comments[0].id;
  await screen.findByTestId(`commentReplyList-${commentID}`);
  expect(screen.getByText("Comment from Lukas")).toBeDefined();
  expect(screen.getByText("What's up?")).toBeDefined();
});

it("show all replies", async () => {
  const commentID = comments[0].id;
  const commentReplyList = await screen.findByTestId(
    `commentReplyList-${commentID}`
  );

  // Get amount of comments before.
  const commentsBefore = within(commentReplyList).getAllByTestId(
    /^comment[-]comment[-]/
  ).length;

  // show all button should be rendered and enabled
  const showAllButton = await screen.findByRole("button", { name: "Show All" });
  expect(showAllButton).toBeDefined();
  expect(showAllButton).toBeEnabled();

  // when clicked, show all button should be disabled and then not in the document
  await act(async () => {
    userEvent.click(showAllButton);
  });

  expect(showAllButton).toBeDisabled();
  expect(within(commentReplyList).queryByText("Show All")).toBeNull();

  // after show all has been clicked, we should see one additional reply included
  expect(
    within(commentReplyList).getAllByTestId(/^comment[-]comment[-]/).length
  ).toBe(commentsBefore + 1);
  expect(screen.getByText("Comment from Isabelle")).toBeDefined();
  expect(screen.getByText("Hey!")).toBeDefined();
});
