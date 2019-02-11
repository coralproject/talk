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
      createComment: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, {
              input: {
                storyID: stories[0].id,
                body: "<b>Hello world!</b>",
                clientMutationId: "0",
              },
            })
            .returns({
              // TODO: add a type assertion here to ensure that if the type changes, that the test will fail
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

it("post a comment", async () => {
  const tabPane = await waitForElement(() =>
    within(testRenderer.root).getByTestID("current-tab-pane")
  );

  testRenderer.root
    .findByProps({ inputId: "comments-postCommentForm-field" })
    .props.onChange({ html: "<b>Hello world!</b>" });

  timekeeper.freeze(new Date(baseComment.createdAt));

  testRenderer.root
    .findByProps({ id: "comments-postCommentForm-form" })
    .props.onSubmit();

  timekeeper.reset();

  // Test optimistic response.
  expect(
    within(within(tabPane).queryAllByTestID(/^comment-/)[0]).toJSON()
  ).toMatchSnapshot("optimistic response");

  // Test for server response.
  await waitForElement(() =>
    within(within(tabPane).queryAllByTestID(/^comment-/)[0]).getByText(
      "<b>Hello world! (from server)</b>"
    )
  );
});
