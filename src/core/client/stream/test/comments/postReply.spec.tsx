import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";
import timekeeper from "timekeeper";

import {
  createSinonStub,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import { baseComment, settings, stories, users } from "../fixtures";
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
            .withArgs(undefined, { id: stories[0].id, url: null })
            .returns(stories[0])
      ),
    },
    Mutation: {
      createCommentReply: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, {
              input: {
                storyID: stories[0].id,
                parentID: stories[0].comments.edges[0].node.id,
                parentRevisionID: stories[0].comments.edges[0].node.revision.id,
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
      localRecord.setValue(stories[0].id, "storyID");
      localRecord.setValue(true, "loggedIn");
    },
  }));
});

it("post a reply", async () => {
  const streamLog = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-stream-log")
  );

  const comment = within(streamLog).getByTestID("comment-comment-0");

  // Open reply form.
  within(comment)
    .getByText("Reply", { selector: "button" })
    .props.onClick();

  const form = await waitForElement(() => within(comment).getByType("form"));
  expect(within(comment).toJSON()).toMatchSnapshot("open reply form");

  // Write reply .
  testRenderer.root
    .findByProps({ inputId: "comments-replyCommentForm-rte-comment-0" })
    .props.onChange({ html: "<strong>Hello world!</strong>" });

  timekeeper.freeze(new Date(baseComment.createdAt));
  form.props.onSubmit();

  const commentReplyList = within(streamLog).getByTestID(
    "commentReplyList-comment-0"
  );

  // Test optimistic response.
  expect(within(commentReplyList).toJSON()).toMatchSnapshot(
    "optimistic response"
  );
  timekeeper.reset();

  // Test after server response.
  await waitForElement(() =>
    within(commentReplyList).getByText("(from server)", { exact: false })
  );
});
