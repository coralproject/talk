import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import {
  act,
  createSinonStub,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import {
  comments,
  commentWithReplies,
  settings,
  stories,
} from "../../fixtures";
import create from "./create";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const commentStub = {
    ...commentWithReplies,
    parentCount: 2,
    parents: {
      pageInfo: {
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
    },
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
      stream: createSinonStub(
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
  const tabPane = await waitForElement(() =>
    within(testRenderer.root).getByTestID("current-tab-pane")
  );
  expect(within(tabPane).toJSON()).toMatchSnapshot();
  expect(await within(testRenderer.root).axe()).toHaveNoViolations();
});

it("show all comments", async () => {
  const mockEvent = {
    preventDefault: sinon.mock().once(),
  };

  const tabPane = await waitForElement(() =>
    within(testRenderer.root).getByTestID("current-tab-pane")
  );

  await act(async () => {
    within(tabPane)
      .getByText("View Full Discussion")
      .props.onClick(mockEvent);
    await waitForElement(() =>
      within(testRenderer.root).getByTestID("comments-allComments-log")
    );
  });

  mockEvent.preventDefault.verify();
});
