import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import {
  act,
  createSinonStub,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { comments, settings, stories } from "../../fixtures";
import create from "./create";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const commentStub = {
    ...comments[0],
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
      comment: () => null,
      story: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s
            .withArgs(undefined, { id: storyStub.id, url: null })
            .returns(storyStub)
      ),
      stream: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s
            .withArgs(undefined, { id: storyStub.id, url: null, mode: null })
            .returns(storyStub)
      ),
      settings: sinon.stub().returns(settings),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(storyStub.id, "storyID");
      localRecord.setValue("unknown-comment-id", "commentID");
    },
  }));
});

it("renders permalink view with unknown comment", async () => {
  const tabPane = await waitForElement(() =>
    within(testRenderer.root).getByTestID("current-tab-pane")
  );
  expect(within(tabPane).toJSON()).toMatchSnapshot();
});

it("show all comments", async () => {
  const mockEvent = {
    preventDefault: sinon.mock().once(),
  };

  const tabPane = await waitForElement(() =>
    within(testRenderer.root).getByTestID("current-tab-pane")
  );

  await act(async () => {
    within(tabPane).getByText("View full discussion").props.onClick(mockEvent);

    await waitForElement(() =>
      within(tabPane).getByTestID("comments-allComments-log")
    );
  });
  mockEvent.preventDefault.verify();
});
