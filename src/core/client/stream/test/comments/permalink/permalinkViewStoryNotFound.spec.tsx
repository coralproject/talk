import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { waitForElement, within } from "coral-framework/testHelpers";
import create from "coral-stream/test/comments/create";
import { settings } from "coral-stream/test/fixtures";

let testRenderer: ReactTestRenderer;
beforeEach(() => {
  const resolvers = {
    Query: {
      comment: () => null,
      story: () => null,
      settings: sinon.stub().returns(settings),
    },
  };

  ({ testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue("unknown-story-id", "storyID");
      localRecord.setValue("unknown-comment-id", "commentID");
    },
  }));
});

it("renders permalink view with unknown story", async () => {
  const tabPane = await waitForElement(() =>
    within(testRenderer.root).getByTestID("current-tab-pane")
  );
  expect(within(tabPane).toJSON()).toMatchSnapshot();
});
