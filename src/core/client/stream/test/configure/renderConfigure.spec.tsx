import sinon from "sinon";

import { act, waitForElement, within } from "coral-framework/testHelpers";

import { moderators, settings, stories } from "../fixtures";
import create from "./create";

async function createTestRenderer(
  resolver: any = {},
  options: { muteNetworkErrors?: boolean; status?: string } = {}
) {
  const resolvers = {
    Query: {
      settings: sinon.stub().returns(settings),
      story: sinon.stub().callsFake((_: any, variables: any) => {
        expectAndFail(variables).toEqual({ id: stories[0].id, url: null });
        return stories[0];
      }),
      viewer: sinon.stub().returns(moderators[0]),
      ...resolver.Query,
    },
    ...resolver,
  };

  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(stories[0].id, "storyID");
    },
  });

  return await act(async () => {
    const tabPane = await waitForElement(() =>
      within(testRenderer.root).getByTestID("current-tab-pane")
    );

    return { testRenderer, tabPane };
  });
}

it("renders configure", async () => {
  const { tabPane, testRenderer } = await createTestRenderer();
  expect(within(tabPane).toJSON()).toMatchSnapshot();
  expect(await within(testRenderer.root).axe()).toHaveNoViolations();
});
