import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import {
  act,
  createSinonStub,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { comments, commentsFromStaff, settings, stories } from "../../fixtures";
import create from "./create";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const commentStub = {
    ...comments[0],
    parentCount: 2,
    rootParent: commentsFromStaff[0],
    parents: createSinonStub(
      (s) => s.throws(),
      (s) =>
        s.withArgs({ last: 0 }).returns({
          pageInfo: {
            startCursor: "0",
            hasPreviousPage: true,
          },
          edges: [],
        }),
      (s) =>
        s.withArgs({ last: 5, before: "0" }).returns({
          pageInfo: {
            startCursor: "2",
            hasPreviousPage: false,
          },
          edges: [
            {
              node: commentsFromStaff[0],
              cursor: commentsFromStaff[0].createdAt,
            },
            {
              node: comments[1],
              cursor: comments[1].createdAt,
            },
          ],
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
      comment: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s.withArgs(undefined, { id: commentStub.id }).returns(commentStub)
      ),
      story: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s
            .withArgs(undefined, { id: storyStub.id, url: null })
            .returns(storyStub)
      ),
      settings: sinon.stub().returns(settings),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(storyStub.id, "storyID");
      localRecord.setValue(commentStub.id, "commentID");
    },
  }));
});

it("renders conversation thread", async () => {
  const conversationThread = await waitForElement(() =>
    within(testRenderer.root).getByTestID(
      "comments-permalinkView-conversationThread"
    )
  );
  expect(within(conversationThread).toJSON()).toMatchSnapshot();
});

it("shows more of this conversation", async () => {
  const conversationThread = await waitForElement(() =>
    within(testRenderer.root).getByTestID(
      "comments-permalinkView-conversationThread"
    )
  );

  // Show hidden comments.
  act(() => {
    within(conversationThread)
      .getByText("Show More of This Conversation")
      .props.onClick();
  });

  // Wait until button disappears.
  await act(() =>
    wait(() =>
      expect(
        within(conversationThread).queryByText("Show More of This Conversation")
      ).toBeNull()
    )
  );

  expect(within(conversationThread).toJSON()).toMatchSnapshot();
});
