import sinon from "sinon";
import timekeeper from "timekeeper";

import { ERROR_CODES } from "talk-common/errors";
import { InvalidRequestError } from "talk-framework/lib/errors";
import {
  createSinonStub,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import { baseComment, settings, stories, users } from "../fixtures";
import create from "./create";

function createTestRenderer(
  resolver: any,
  options: { muteNetworkErrors?: boolean } = {}
) {
  const resolvers = {
    ...resolver,
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
  };

  return create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(stories[0].id, "storyID");
      localRecord.setValue(true, "loggedIn");
    },
  });
}

it("post a reply", async () => {
  const { testRenderer } = createTestRenderer({
    Mutation: {
      createCommentReply: sinon.stub().callsFake((_, data) => {
        expect(data).toEqual({
          input: {
            storyID: stories[0].id,
            parentID: stories[0].comments.edges[0].node.id,
            parentRevisionID: stories[0].comments.edges[0].node.revision.id,
            body: "<b>Hello world!</b>",
            clientMutationId: "0",
          },
        });
        return {
          edge: {
            cursor: null,
            node: {
              ...baseComment,
              id: "comment-x",
              author: users[0],
              body: "<b>Hello world! (from server)</b>",
            },
          },
          clientMutationId: "0",
        };
      }),
    },
  });
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
    .props.onChange({ html: "<b>Hello world!</b>" });

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

it("post a reply and handle server error", async () => {
  const { testRenderer } = createTestRenderer(
    {
      Mutation: {
        createCommentReply: sinon.stub().callsFake(() => {
          throw new InvalidRequestError({ code: ERROR_CODES.INTERNAL_ERROR });
        }),
      },
    },
    { muteNetworkErrors: true }
  );
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
    .props.onChange({ html: "<b>Hello world!</b>" });

  timekeeper.freeze(new Date(baseComment.createdAt));
  form.props.onSubmit();

  // Look for internal error being displayed.
  await waitForElement(() => within(comment).getByText("INTERNAL_ERROR"));
});
