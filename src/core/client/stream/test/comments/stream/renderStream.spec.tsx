import sinon from "sinon";

import { waitForElement, within } from "coral-framework/testHelpers";

import { settings, stories } from "../../fixtures";
import create from "./create";

const story = stories[2];

async function createTestRenderer(
  resolver: any = {},
  options: { muteNetworkErrors?: boolean } = {}
) {
  const resolvers = {
    ...resolver,
    Query: {
      settings: sinon.stub().returns(settings),
      story: sinon.stub().callsFake((_: any, variables: any) => {
        expectAndFail(variables.id).toBe(story.id);
        return story;
      }),
      ...resolver.Query,
    },
  };

  const { testRenderer, context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(story.id, "storyID");
    },
  });

  return {
    testRenderer,
    context,
  };
}

it("renders comment stream", async () => {
  const { testRenderer } = await createTestRenderer();
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-stream-log")
  );
  expect(within(testRenderer.root).toJSON()).toMatchSnapshot();
});
