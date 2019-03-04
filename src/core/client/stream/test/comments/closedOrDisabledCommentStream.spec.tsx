import sinon from "sinon";

import { waitForElement, within } from "talk-framework/testHelpers";

import { settings, stories } from "../fixtures";
import create from "./create";

afterEach(() => jest.useRealTimers());

async function createTestRenderer(
  resolver: any = {},
  options: { muteNetworkErrors?: boolean } = {}
) {
  const resolvers = {
    ...resolver,
    Query: {
      settings: sinon.stub().returns(settings),
      story: sinon.stub().callsFake((_: any, variables: any) => {
        expect(variables.id).toBe(stories[0].id);
        return stories[0];
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
      localRecord.setValue(stories[0].id, "storyID");
    },
  });

  return {
    testRenderer,
    context,
  };
}

it("renders disabled comment stream", async () => {
  const { testRenderer } = await createTestRenderer({
    Query: {
      settings: sinon.stub().callsFake(() => ({
        ...settings,
        disableCommenting: {
          enabled: true,
          message: "commenting disabled",
        },
      })),
    },
  });
  await waitForElement(() =>
    within(testRenderer.root).getByText("commenting disabled")
  );
});

it("renders closed comment stream", async () => {
  const { testRenderer } = await createTestRenderer({
    Query: {
      story: sinon.stub().callsFake(() => ({
        ...stories[0],
        isClosed: true,
      })),
    },
  });
  await waitForElement(() =>
    within(testRenderer.root).getByText("Story is closed")
  );
});

it("auto close comment stream when story closed at has been reached", async () => {
  const closeIn = 360000;
  const now = new Date();
  const later = new Date(now.valueOf() + closeIn);
  jest.useFakeTimers();

  const { testRenderer } = await createTestRenderer({
    Query: {
      story: sinon.stub().callsFake(() => ({
        ...stories[0],
        closedAt: later.toISOString(),
        isClosed: false,
      })),
    },
  });
  expect(within(testRenderer.root).queryByText("Story is closed")).toBeNull();

  await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-stream-log")
  );

  jest.advanceTimersByTime(closeIn);

  await waitForElement(() =>
    within(testRenderer.root).getByText("Story is closed")
  );
});
