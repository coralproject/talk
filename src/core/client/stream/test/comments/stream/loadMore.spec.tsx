import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import {
  act,
  createSinonStub,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { comments, settings, stories } from "../../fixtures";
import create from "./create";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const storyStub = {
    ...stories[0],
    comments: createSinonStub(
      s => s.throws(),
      s =>
        s.withArgs({ first: 5, orderBy: "CREATED_AT_DESC" }).returns({
          edges: [
            {
              node: comments[0],
              cursor: comments[0].createdAt,
            },
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
            first: 10,
            orderBy: "CREATED_AT_DESC",
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

  const resolvers = {
    Query: {
      story: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(
              undefined,
              sinon
                .match({ id: storyStub.id, url: null })
                .or(sinon.match({ id: storyStub.id }))
            )
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
    },
  }));
});

it("renders comment stream with load more button", async () => {
  const streamLog = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-stream-log")
  );
  expect(within(streamLog).toJSON()).toMatchSnapshot();
});

it("loads more comments", async () => {
  const streamLog = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-stream-log")
  );

  // Get amount of comments before.
  const commentsBefore = within(streamLog).getAllByTestID(/^comment-/).length;

  await act(async () => {
    within(streamLog)
      .getByText("Load More")
      .props.onClick();

    // Wait for load more button to disappear

    // Should now have one more comment
    await wait(() =>
      expect(within(streamLog).queryByText("Load More")).toBeNull()
    );
  });
  expect(within(streamLog).getAllByTestID(/^comment-/).length).toBe(
    commentsBefore + 1
  );
});
