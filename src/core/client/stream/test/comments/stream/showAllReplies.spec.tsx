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
  const commentStub = {
    ...comments[0],
    replies: createSinonStub(
      (s) => s.throws(),
      (s) =>
        s.withArgs({ first: 3, orderBy: "CREATED_AT_ASC" }).returns({
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
      (s) =>
        s
          .withArgs({
            first: sinon.match((n) => n > 10000),
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
      settings: sinon.stub().returns(settings),
      comment: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s.withArgs(undefined, { id: commentStub.id }).returns(commentStub)
      ),
      stream: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s
            .withArgs(undefined, { id: storyStub.id, url: null })
            .returns(storyStub)
      ),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(storyStub.id, "storyID");
    },
  }));
});

it("renders comment stream", async () => {
  const commentID = comments[0].id;
  const commentReplyList = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`commentReplyList-${commentID}`)
  );
  // Wait for loading.
  expect(within(commentReplyList).toJSON()).toMatchSnapshot();
});

it("show all replies", async () => {
  const commentID = comments[0].id;
  const commentReplyList = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`commentReplyList-${commentID}`)
  );

  // Get amount of comments before.
  const commentsBefore = within(commentReplyList).getAllByTestID(
    /^comment[-]comment[-]/
  ).length;

  await act(async () => {
    within(commentReplyList).getByText("Show All").props.onClick();
    // Wait for loading.
    await wait(() =>
      expect(within(commentReplyList).queryByText("Show All")).toBeNull()
    );
  });

  expect(
    within(commentReplyList).getAllByTestID(/^comment[-]comment[-]/).length
  ).toBe(commentsBefore + 1);
});
