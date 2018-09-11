import { ReactTestRenderer } from "react-test-renderer";
import timekeeper from "timekeeper";

import { timeout } from "talk-common/utils";
import { createSinonStub } from "talk-framework/testHelpers";

import create from "./create";
import { assets, users } from "./fixtures";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const resolvers = {
    Query: {
      asset: createSinonStub(
        s => s.throws(),
        s => s.withArgs(undefined, { id: assets[0].id }).returns(assets[0])
      ),
      me: createSinonStub(
        s => s.throws(),
        s => s.withArgs(undefined, { clientAuthRevision: 0 }).returns(users[0])
      ),
    },
    Mutation: {
      editComment: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, {
              input: {
                assetID: assets[0].id,
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
              },
              clientMutationId: "0",
            })
      ),
    },
  };

  timekeeper.freeze(assets[0].comments.edges[0].node.createdAt);
  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(assets[0].id, "assetID");
    },
  }));
});

afterAll(() => {
  timekeeper.reset();
});

it("edit a comment", async () => {
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
