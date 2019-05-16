import sinon from "sinon";

import { waitForElement, within } from "coral-framework/testHelpers";

import { settings, stories } from "../fixtures";
import create from "./create";

function createTestRenderer() {
  const resolvers = {
    Query: {
      story: sinon.stub().returns(stories[0]),
      settings: sinon.stub().returns({
        ...settings,
        communityGuidelines: {
          content: "## Community Guidelines",
          enabled: true,
        },
      }),
    },
  };

  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(stories[0].id, "storyID");
    },
  });
  return { testRenderer, resolvers };
}
it("renders comment stream with community guidelines", async () => {
  const { testRenderer } = createTestRenderer();
  await waitForElement(() =>
    within(testRenderer.root).getByText("Community Guidelines", {
      exact: false,
    })
  );
  const tabPane = within(testRenderer.root).getByTestID("current-tab-pane");
  expect(within(tabPane).toJSON()).toMatchSnapshot();
});
