import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";
import timekeeper from "timekeeper";

import { timeout } from "talk-common/utils";
import { createSinonStub } from "talk-framework/testHelpers";

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
      createComment: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, {
              input: {
                storyID: storyWithDeepestReplies.id,
                parentID: "comment-with-deepest-replies-5",
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
  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("post a reply", async () => {
  // Wait for loading.
  await timeout();

  // Open reply form.
  testRenderer.root
    .findByProps({
      id:
        "comments-commentContainer-replyButton-comment-with-deepest-replies-5",
    })
    .props.onClick();

  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot("open reply form");

  // Write reply .
  testRenderer.root
    .findByProps({
      inputId: "comments-replyCommentForm-rte-comment-with-deepest-replies-5",
    })
    .props.onChange({ html: "<strong>Hello world!</strong>" });

  timekeeper.freeze(new Date(baseComment.createdAt));
  testRenderer.root
    .findByProps({
      id: "comments-replyCommentForm-form-comment-with-deepest-replies-5",
    })
    .props.onSubmit();
  // Test optimistic response.
  expect(testRenderer.toJSON()).toMatchSnapshot("optimistic response");
  timekeeper.reset();

  // Wait for loading.
  await timeout();

  // Test after server response.
  expect(testRenderer.toJSON()).toMatchSnapshot("server response");
});
