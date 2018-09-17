import timekeeper from "timekeeper";

import { timeout } from "talk-common/utils";
import { createSinonStub } from "talk-framework/testHelpers";

import { assets, users } from "../fixtures";
import create from "./create";

function createTestRenderer() {
  const resolvers = {
    Query: {
      asset: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, { id: assets[0].id, url: null })
            .returns(assets[0])
      ),
      me: createSinonStub(
        s => s.throws(),
        s => s.withArgs(undefined).returns(users[0])
      ),
    },
    Mutation: {
      editComment: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, {
              input: {
                commentID: assets[0].comments.edges[0].node.id,
                body: "Edited!",
                clientMutationId: "0",
              },
            })
            .returns({
              // TODO: add a type assertion here to ensure that if the type changes, that the test will fail
              comment: {
                id: assets[0].comments.edges[0].node.id,
                body: "Edited! (from server)",
                editing: {
                  edited: true,
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
      localRecord.setValue(assets[0].id, "assetID");
    },
  });
  return testRenderer;
}

afterAll(() => {
  timekeeper.reset();
});

it("edit a comment", async () => {
  timekeeper.freeze(assets[0].comments.edges[0].node.createdAt);
  const testRenderer = createTestRenderer();

  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot("render stream");

  // Open edit form.
  testRenderer.root
    .findByProps({ id: "comments-commentContainer-editButton-comment-0" })
    .props.onClick();
  expect(testRenderer.toJSON()).toMatchSnapshot("edit form");

  testRenderer.root
    .findByProps({ inputId: "comments-editCommentForm-rte-comment-0" })
    .props.onChange({ html: "Edited!" });

  testRenderer.root
    .findByProps({ id: "comments-editCommentForm-form-comment-0" })
    .props.onSubmit();

  // Test optimistic response.
  expect(testRenderer.toJSON()).toMatchSnapshot("optimistic response");

  // Wait for loading.
  await timeout();

  // Test after server response.
  expect(testRenderer.toJSON()).toMatchSnapshot("server response");
});

it("cancel edit", async () => {
  timekeeper.freeze(assets[0].comments.edges[0].node.createdAt);
  const testRenderer = createTestRenderer();

  await timeout();

  // Open edit form.
  testRenderer.root
    .findByProps({ id: "comments-commentContainer-editButton-comment-0" })
    .props.onClick();

  // Cacnel edit form.
  testRenderer.root
    .findByProps({ id: "comments-editCommentForm-cancelButton-comment-0" })
    .props.onClick();
  expect(testRenderer.toJSON()).toMatchSnapshot("edit canceled");
});

it("shows expiry message", async () => {
  timekeeper.freeze(assets[0].comments.edges[0].node.createdAt);
  const testRenderer = createTestRenderer();

  await timeout();
  jest.useFakeTimers();
  // Open edit form.
  testRenderer.root
    .findByProps({ id: "comments-commentContainer-editButton-comment-0" })
    .props.onClick();

  timekeeper.reset();
  jest.runOnlyPendingTimers();

  // Show edit time expired.
  expect(testRenderer.toJSON()).toMatchSnapshot("edit time expired");

  // Close edit form.
  testRenderer.root
    .findByProps({ id: "comments-editCommentForm-closeButton-comment-0" })
    .props.onClick();
  expect(testRenderer.toJSON()).toMatchSnapshot("edit form closed");
});
