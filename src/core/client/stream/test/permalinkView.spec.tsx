import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { createSinonStub } from "talk-framework/testHelpers";

import create from "./create";
import { assets, comments } from "./fixtures";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const commentStub = {
    ...comments[0],
  };

  const assetStub = {
    ...assets[0],
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
      asset: createSinonStub(
        s => s.throws(),
        s => s.withArgs(undefined, { id: assetStub.id }).returns(assetStub)
      ),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(assetStub.id, "assetID");
      localRecord.setValue(commentStub.id, "commentID");
    },
  }));
});

it("renders permalink view", async () => {
  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("show all comments", async () => {
  const mockEvent = {
    preventDefault: sinon.mock().once(),
  };
  testRenderer.root
    .findByProps({
      id: "talk-comments-permalinkView-showAllComments",
    })
    .props.onClick(mockEvent);
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
  mockEvent.preventDefault.verify();
});
