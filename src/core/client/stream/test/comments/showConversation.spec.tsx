import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { createSinonStub } from "talk-framework/testHelpers";

import { comments, settings, storyWithDeepestReplies } from "../fixtures";
import create from "./create";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const resolvers = {
    Query: {
      story: createSinonStub(
        s => s.throws(),
        s => s.returns(storyWithDeepestReplies)
      ),
      comment: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, { id: "comment-with-deepest-replies-5" })
            .returns({
              ...comments[0],
              id: "comment-with-deepest-replies-5",
            })
      ),
      settings: sinon.stub().returns(settings),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(storyWithDeepestReplies.id, "storyID");
    },
  }));
});

it("renders comment stream", async () => {
  // Wait for loading.
  await timeout();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("shows conversation", async () => {
  const mockEvent = {
    preventDefault: sinon.mock().once(),
  };

  // Wait for loading.
  await timeout();

  testRenderer.root
    .findByProps({
      id:
        "comments-commentContainer-showConversation-comment-with-deepest-replies-5",
    })
    .props.onClick(mockEvent);

  // Wait for loading.
  await timeout();

  expect(testRenderer.toJSON()).toMatchSnapshot();
});
