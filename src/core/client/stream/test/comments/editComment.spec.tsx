import sinon from "sinon";
import timekeeper from "timekeeper";

import {
  createSinonStub,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import { settings, stories, users } from "../fixtures";
import create from "./create";

function createTestRenderer() {
  const resolvers = {
    Query: {
      story: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, { id: stories[0].id, url: null })
            .returns(stories[0])
      ),
      me: sinon.stub().returns(users[0]),
      settings: sinon.stub().returns(settings),
    },
    Mutation: {
      editComment: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, {
              input: {
                commentID: stories[0].comments.edges[0].node.id,
                body: "Edited!",
                clientMutationId: "0",
              },
            })
            .returns({
              // TODO: add a type assertion here to ensure that if the type changes, that the test will fail
              comment: {
                id: stories[0].comments.edges[0].node.id,
                body: "Edited! (from server)",
                editing: {
                  edited: true,
                },
                revision: {
                  id: stories[0].comments.edges[0].node.revision.id,
                },
              },
              clientMutationId: "0",
            })
      ),
    },
  };

  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(stories[0].id, "storyID");
      localRecord.setValue(true, "loggedIn");
    },
  });
  return testRenderer;
}

afterAll(() => {
  timekeeper.reset();
});

it("edit a comment", async () => {
  const commentData = stories[0].comments.edges[0].node;
  timekeeper.freeze(commentData.createdAt);
  const testRenderer = createTestRenderer();

  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentData.id}`)
  );
  expect(within(comment).toJSON()).toMatchSnapshot(
    "render comment with edit button"
  );

  // Open edit form.
  within(comment)
    .getByText("Edit")
    .props.onClick();
  expect(within(comment).toJSON()).toMatchSnapshot("edit form");

  testRenderer.root
    .findByProps({ inputId: `comments-editCommentForm-rte-${commentData.id}` })
    .props.onChange({ html: "Edited!" });

  within(comment)
    .getByType("form")
    .props.onSubmit();

  // Test optimistic response.
  expect(within(comment).toJSON()).toMatchSnapshot("optimistic response");

  // Wait for server response.
  await waitForElement(() =>
    within(comment).getByText("Edited! (from server)")
  );

  // Test after server response.
  expect(within(comment).toJSON()).toMatchSnapshot("server response");
});

it("cancel edit", async () => {
  const commentData = stories[0].comments.edges[0].node;
  timekeeper.freeze(commentData.createdAt);
  const testRenderer = createTestRenderer();

  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentData.id}`)
  );

  // Open edit form.
  within(comment)
    .getByText("Edit")
    .props.onClick();

  // Cancel edit form.
  within(comment)
    .getByText("Cancel")
    .props.onClick();

  expect(within(comment).toJSON()).toMatchSnapshot();
});

it("shows expiry message", async () => {
  const commentData = stories[0].comments.edges[0].node;
  timekeeper.freeze(commentData.createdAt);
  const testRenderer = createTestRenderer();

  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${commentData.id}`)
  );

  jest.useFakeTimers();

  // Open edit form.
  within(comment)
    .getByText("Edit")
    .props.onClick();

  timekeeper.reset();
  jest.runOnlyPendingTimers();

  // Show edit time expired.
  expect(within(comment).toJSON()).toMatchSnapshot("edit time expired");

  // Close edit form.
  within(comment)
    .getByText("Close")
    .props.onClick();
  expect(within(comment).toJSON()).toMatchSnapshot("edit form closed");
});
