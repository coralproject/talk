import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";
import timekeeper from "timekeeper";

import {
  act,
  createSinonStub,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import {
  baseComment,
  commenters,
  settings,
  storyWithDeepestReplies,
} from "../../fixtures";
import create from "./create";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const resolvers = {
    Query: {
      settings: sinon.stub().returns(settings),
      viewer: sinon.stub().returns(commenters[0]),
      stream: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s
            .withArgs(undefined, { id: storyWithDeepestReplies.id, url: null })
            .returns(storyWithDeepestReplies)
      ),
    },
    Mutation: {
      createCommentReply: sinon.stub().callsFake((_: any, data: any) => {
        expectAndFail(data.input).toMatchObject({
          storyID: storyWithDeepestReplies.id,
          parentID: "comment-with-deepest-replies-3",
          parentRevisionID: "revision-0",
          body: "<b>Hello world!</b>",
        });
        return {
          edge: {
            cursor: "",
            node: {
              ...baseComment,
              id: "comment-x",
              author: commenters[0],
              body: "<b>Hello world! (from server)</b>",
            },
          },
          clientMutationId: data.input.clientMutationId,
        };
      }),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(storyWithDeepestReplies.id, "storyID");
    },
  }));
});

it("renders comment stream", async () => {
  const streamLog = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );
  // Wait for loading.
  expect(within(streamLog).toJSON()).toMatchSnapshot();
});

it("post a reply", async () => {
  const streamLog = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );

  const deepestReply = within(streamLog).getByTestID(
    "comment-comment-with-deepest-replies-3"
  );

  // Open reply form.
  act(() =>
    within(deepestReply).getByTestID("comment-reply-button").props.onClick()
  );

  const form = await waitForElement(() =>
    within(deepestReply).getByType("form")
  );
  expect(within(deepestReply).toJSON()).toMatchSnapshot("open reply form");

  // Write reply .
  act(() =>
    testRenderer.root
      .findByProps({
        inputID: "comments-replyCommentForm-rte-comment-with-deepest-replies-3",
      })
      .props.onChange("<b>Hello world!</b>")
  );

  timekeeper.freeze(new Date(baseComment.createdAt));
  act(() => {
    form.props.onSubmit();
  });

  const deepestReplyList = within(streamLog).getByTestID(
    "commentReplyList-comment-with-deepest-replies-3"
  );

  // Test optimistic response.
  expect(within(deepestReplyList).toJSON()).toMatchSnapshot(
    "optimistic response"
  );
  timekeeper.reset();

  // Test after server response.
  await act(async () => {
    await waitForElement(() =>
      within(deepestReplyList).getByText("(from server)", { exact: false })
    );
  });
});
