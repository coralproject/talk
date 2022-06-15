import { screen } from "@testing-library/react";
import sinon from "sinon";

import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";

import { createContext } from "../create";
import { settings, stories } from "../../fixtures";

function createTestRenderer() {
  const resolvers = {
    Query: {
      stream: sinon.stub().returns(stories[0]),
      settings: sinon.stub().returns({
        ...settings,
        communityGuidelines: {
          content: "## Community Guidelines",
          enabled: true,
        },
      }),
    },
  };

  const { context } = createContext({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(stories[0].id, "storyID");
    },
  });
  customRenderAppWithContext(context);
}
it("renders comment stream with community guidelines", async () => {
  await createTestRenderer();
  const communityGuidelines = await screen.findByText("Community Guidelines");
  expect(communityGuidelines).toBeVisible();
  expect(screen.getByTestId("comments-allComments-log")).toBeVisible();
});
