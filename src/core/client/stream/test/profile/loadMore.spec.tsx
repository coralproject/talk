import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { createSinonStub } from "talk-framework/testHelpers";

import { assets, comments, meWithComments } from "../fixtures";
import create from "./create";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const meStub = {
    ...meWithComments,
    comments: createSinonStub(
      s => s.throws(),
      s =>
        s.withArgs({ first: 5, orderBy: "CREATED_AT_DESC" }).returns({
          edges: [
            {
              node: { ...comments[0], asset: assets[0] },
              cursor: comments[0].createdAt,
            },
            {
              node: { ...comments[1], asset: assets[0] },
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
            first: 10,
            orderBy: "CREATED_AT_DESC",
            after: comments[1].createdAt,
          })
          .returns({
            edges: [
              {
                node: { ...comments[2], asset: assets[0] },
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

  const resolvers = {
    Query: {
      asset: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, { id: assets[0].id, url: null })
            .returns(assets[0])
      ),
      me: sinon.stub().returns(meStub),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(assets[0].id, "assetID");
    },
  }));
});

it("renders comment stream", async () => {
  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("loads more comments", async () => {
  testRenderer.root
    .findByProps({ id: "talk-profile-commentHistory-loadMore" })
    .props.onClick();

  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
