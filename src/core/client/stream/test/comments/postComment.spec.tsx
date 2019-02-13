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

it("post a comment", async () => {
  const { testRenderer } = createTestRenderer({
    Mutation: {
      createComment: sinon.stub().callsFake((_, data) => {
        expect(data).toEqual({
          input: {
            storyID: stories[0].id,
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

it("post a comment and handle server error", async () => {
  const { testRenderer } = createTestRenderer(
    {
      Mutation: {
        createComment: sinon.stub().callsFake(() => {
          throw new InvalidRequestError({ code: ERROR_CODES.INTERNAL_ERROR });
        }),
      },
    },
    { muteNetworkErrors: true }
  );

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

  // Look for internal error being displayed.
  await waitForElement(() => within(tabPane).getByText("INTERNAL_ERROR"));
});
