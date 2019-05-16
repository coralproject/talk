import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import {
  createSinonStub,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { settings, storyWithDeepReplies } from "../fixtures";
import create from "./create";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const resolvers = {
    Query: {
      story: createSinonStub(
        s => s.throws(),
        s =>
          s
            .withArgs(undefined, { id: storyWithDeepReplies.id, url: null })
            .returns(storyWithDeepReplies)
      ),
      settings: sinon.stub().returns(settings),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(storyWithDeepReplies.id, "storyID");
    },
  }));
});

it("renders reply list", async () => {
  const commentID = storyWithDeepReplies.comments.edges[1].node.id;
  const commentReplyList = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`commentReplyList-${commentID}`)
  );
  // Wait for loading.
  expect(within(commentReplyList).toJSON()).toMatchSnapshot();
});
