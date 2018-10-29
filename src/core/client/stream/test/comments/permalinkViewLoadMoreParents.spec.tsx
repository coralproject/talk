import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { createSinonStub } from "talk-framework/testHelpers";

import { comments, settings, stories } from "../fixtures";
import create from "./create";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const commentStub = {
    ...comments[0],
    parentCount: 2,
    rootParent: comments[2],
    parents: createSinonStub(
      s => s.throws(),
      s =>
        s.withArgs({ last: 0 }).returns({
          pageInfo: {
            startCursor: "0",
            hasPreviousPage: true,
          },
          edges: [],
        }),
      s =>
        s.withArgs({ last: 5, before: "0" }).returns({
          pageInfo: {
            startCursor: "2",
            hasPreviousPage: false,
          },
          edges: [
            {
              node: comments[1],
              cursor: comments[1].createdAt,
            },
            {
              node: comments[2],
              cursor: comments[2].createdAt,
            },
          ],
        })
    ),
  };

  const storyStub = {
    ...stories[0],
    comments: {
      pageInfo: {
        hasNextPage: false,
      },
      edges: [
        {
          node: commentStub,
          cursor: commentStub.createdAt,
        },
      ],
    },
  };

  const resolvers = {
    Query: {
      comment: createSinonStub(
        s => s.throws(),
        s => s.withArgs(undefined, { id: commentStub.id }).returns(commentStub)
      ),
      story: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, { id: storyStub.id, url: null })
            .returns(storyStub)
      ),
      settings: sinon.stub().returns(settings),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(storyStub.id, "storyID");
      localRecord.setValue(commentStub.id, "commentID");
    },
  }));
});

it("renders permalink view", async () => {
  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("views pervious comments", async () => {
  testRenderer.root
    .find(
      node =>
        node.props.onClick &&
        node.props.id === "comments-conversationThread-showHiddenComments"
    )
    .props.onClick();
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
