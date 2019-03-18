import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import {
  createSinonStub,
  wait,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import { comments, meWithComments, settings, stories } from "../fixtures";
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
              node: { ...comments[0], story: stories[0] },
              cursor: comments[0].createdAt,
            },
            {
              node: { ...comments[1], story: stories[0] },
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
                node: { ...comments[2], story: stories[0] },
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
      settings: sinon.stub().returns(settings),
      story: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, { id: stories[0].id, url: null })
            .returns(stories[0])
      ),
      me: sinon.stub().returns(meStub),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(stories[0].id, "storyID");
    },
  }));
});

it("renders profile", async () => {
  const commentHistory = await waitForElement(() =>
    within(testRenderer.root).getByTestID("profile-commentHistory")
  );
  expect(within(commentHistory).toJSON()).toMatchSnapshot();
});

it("loads more comments", async () => {
  const commentHistory = await waitForElement(() =>
    within(testRenderer.root).getByTestID("profile-commentHistory")
  );

  // Get amount of comments before.
  const commentsBefore = within(commentHistory).getAllByTestID(
    /^historyComment-/
  ).length;

  within(commentHistory)
    .getByText("Load More")
    .props.onClick();

  // Wait for loading.
  await wait(() =>
    expect(within(commentHistory).queryByText("Load More")).toBeNull()
  );

  expect(within(commentHistory).getAllByTestID(/^historyComment-/).length).toBe(
    commentsBefore + 1
  );
});
