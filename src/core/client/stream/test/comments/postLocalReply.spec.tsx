import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";
import timekeeper from "timekeeper";

import {
  createSinonStub,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import {
  baseComment,
  settings,
  storyWithDeepestReplies,
  users,
} from "../fixtures";
import create from "./create";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const resolvers = {
    Query: {
      settings: sinon.stub().returns(settings),
      me: sinon.stub().returns(users[0]),
      story: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, { id: storyWithDeepestReplies.id, url: null })
            .returns(storyWithDeepestReplies)
      ),
    },
    Mutation: {
      createCommentReply: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, {
              input: {
                storyID: storyWithDeepestReplies.id,
                parentID: "comment-with-deepest-replies-5",
                parentRevisionID: "revision-0",
                body: "<strong>Hello world!</strong>",
                clientMutationId: "0",
              },
            })
            .returns({
              edge: {
                cursor: null,
                node: {
                  ...baseComment,
                  id: "comment-x",
                  author: users[0],
                  body: "<strong>Hello world! (from server)</strong>",
                },
              },
              clientMutationId: "0",
            })
      ),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(storyWithDeepestReplies.id, "storyID");
      localRecord.setValue(true, "loggedIn");
    },
  }));
});

it("renders comment stream", async () => {
  const streamLog = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-stream-log")
  );
  // Wait for loading.
  expect(within(streamLog).toJSON()).toMatchSnapshot();
});

it("post a reply", async () => {
  const streamLog = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-stream-log")
  );

  const deepestReply = within(streamLog).getByTestID(
    "comment-comment-with-deepest-replies-5"
  );

  // Open reply form.
  within(deepestReply)
    .getByText("Reply", { selector: "button" })
    .props.onClick();

  const form = await waitForElement(() =>
    within(deepestReply).getByType("form")
  );
  expect(within(deepestReply).toJSON()).toMatchSnapshot("open reply form");

  // Write reply .
  testRenderer.root
    .findByProps({
      inputId: "comments-replyCommentForm-rte-comment-with-deepest-replies-5",
    })
    .props.onChange({ html: "<strong>Hello world!</strong>" });

  timekeeper.freeze(new Date(baseComment.createdAt));
  form.props.onSubmit();

  const deepestReplyList = within(streamLog).getByTestID(
    "commentReplyList-comment-with-deepest-replies-5"
  );

  // Test optimistic response.
  expect(within(deepestReplyList).toJSON()).toMatchSnapshot(
    "optimistic response"
  );
  timekeeper.reset();

  // Test after server response.
  await waitForElement(() =>
    within(deepestReplyList).getByText("(from server)", { exact: false })
  );
});
