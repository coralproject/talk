import { act } from "react-test-renderer";
import sinon from "sinon";

import { waitForElement, within } from "coral-framework/testHelpers";

import { settings, stories } from "../../fixtures";
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
      stream: sinon.stub().callsFake((_: any, variables: any) => {
        expectAndFail(variables.id).toBe(stories[0].id);
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
    initLocalState: (localRecord) => {
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
    within(testRenderer.root).getByText("commenting disabled", {
      exact: false,
    })
  );
});

it("renders closed comment stream", async () => {
  const { testRenderer } = await createTestRenderer({
    Query: {
      stream: sinon.stub().callsFake(() => ({
        ...stories[0],
        isClosed: true,
      })),
    },
  });
  await waitForElement(() =>
    within(testRenderer.root).getByText("Story is closed", { exact: false })
  );
});

it("auto close comment stream when story closed at has been reached", async () => {
  const closeIn = 360000;
  const now = new Date();
  const later = new Date(now.valueOf() + closeIn);
  jest.useFakeTimers();

  const { testRenderer } = await createTestRenderer({
    Query: {
      stream: sinon.stub().callsFake(() => ({
        ...stories[0],
        closedAt: later.toISOString(),
        isClosed: false,
      })),
    },
  });
  expect(
    within(testRenderer.root).queryByText("Story is closed", { exact: false })
  ).toBeNull();

  await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );

  await act(async () => {
    jest.advanceTimersByTime(closeIn);
  });

  await waitForElement(() =>
    within(testRenderer.root).getByText("Story is closed", { exact: false })
  );
});
