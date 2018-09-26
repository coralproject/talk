import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { createSinonStub } from "talk-framework/testHelpers";

import { assets, comments, settings } from "../fixtures";
import create from "./create";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const commentStub = {
    ...comments[0],
    replies: createSinonStub(
      s => s.throws(),
      s =>
        s.withArgs({ first: 5, orderBy: "CREATED_AT_ASC" }).returns({
          edges: [
            {
              node: comments[1],
              cursor: comments[1].createdAt,
            },
          ],
          pageInfo: {
            endCursor: comments[1].createdAt,
            hasNextPage: true,
          },
        }),
      s =>
        s
          .withArgs({
            first: sinon.match(n => n > 10000),
            orderBy: "CREATED_AT_ASC",
            after: comments[1].createdAt,
          })
          .returns({
            edges: [
              {
                node: comments[2],
                cursor: comments[2].createdAt,
              },
            ],
            pageInfo: {
              endCursor: comments[2].createdAt,
              hasNextPage: false,
            },
          })
    ),
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
        s =>
          s
            .withArgs(undefined, { id: assetStub.id, url: null })
            .returns(assetStub)
      ),
      settings: createSinonStub(
        s => s.throws(),
        s => s.withArgs(undefined).returns(settings)
      ),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(assetStub.id, "assetID");
    },
  }));
});

it("renders comment stream", async () => {
  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("show all replies", async () => {
  testRenderer.root
    .findByProps({ id: `talk-comments-replyList-showAll--${comments[0].id}` })
    .props.onClick();

  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
