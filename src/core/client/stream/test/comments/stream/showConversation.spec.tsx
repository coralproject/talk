import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import {
  act,
  createSinonStub,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { comments, settings, storyWithDeepestReplies } from "../../fixtures";
import create from "./create";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const resolvers = {
    Query: {
      story: createSinonStub(
        (s) => s.throws(),
        (s) => s.returns(storyWithDeepestReplies)
      ),
      stream: createSinonStub(
        (s) => s.throws(),
        (s) => s.returns(storyWithDeepestReplies)
      ),
      comment: createSinonStub(
        (s) => s.throws(),
        (s) =>
          s
            .withArgs(undefined, { id: "comment-with-deepest-replies-3" })
            .returns({
              ...comments[0],
              id: "comment-with-deepest-replies-3",
            })
      ),
      settings: sinon.stub().returns(settings),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(storyWithDeepestReplies.id, "storyID");
    },
  }));
});

it("renders deepest comment with link", async () => {
  const streamLog = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );
  const deepestReply = within(streamLog).getByTestID(
    "comment-comment-with-deepest-replies-3"
  );
  expect(within(deepestReply).toJSON()).toMatchSnapshot();
});

it("shows conversation", async () => {
  const mockEvent = {
    preventDefault: sinon.mock().once(),
  };
  const streamLog = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );
  await act(async () => {
    within(streamLog)
      .getByText("Read More of this Conversation", { exact: false })
      .props.onClick(mockEvent);

    await waitForElement(() =>
      within(testRenderer.root).getByText(
        "You are currently viewing a single conversation",
        {
          exact: false,
        }
      )
    );
  });
});
