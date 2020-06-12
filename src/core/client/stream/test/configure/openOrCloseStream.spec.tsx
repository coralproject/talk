import sinon from "sinon";

import { act, waitForElement, within } from "coral-framework/testHelpers";

import { moderators, settings, stories } from "../fixtures";
import create from "./create";

async function createTestRenderer(
  resolver: any = {},
  options: { muteNetworkErrors?: boolean; status?: string } = {}
) {
  const resolvers = {
    ...resolver,
    Query: {
      settings: sinon.stub().returns(settings),
      story: sinon.stub().returns(stories[0]),
      viewer: sinon.stub().returns(moderators[0]),
      ...resolver.Query,
    },
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

  const tabPane = await waitForElement(() =>
    within(testRenderer.root).getByTestID("current-tab-pane")
  );

  return { testRenderer, tabPane };
}

it("close stream", async () => {
  const closeStoryStub = sinon.stub().callsFake((_: any, data: any) => {
    expectAndFail(data.input.id).toBe(stories[0].id);
    return {
      story: { ...stories[0], isClosed: true },
      clientMutationId: data.input.clientMutationId,
    };
  });
  const { tabPane } = await createTestRenderer({
    Mutation: {
      closeStory: closeStoryStub,
    },
  });

  const closeButton = within(tabPane).getByText("Close Stream", {
    selector: "button",
  });
  await act(async () => {
    closeButton.props.onClick();
  });

  // Stream should then appear closed.
  await waitForElement(() =>
    within(tabPane).getByText("Open Stream", {
      selector: "button",
    })
  );

  // Should have successfully sent with server.
  expect(closeStoryStub.called).toBe(true);
});

it("opens stream", async () => {
  const openStoryStub = sinon.stub().callsFake((_: any, data: any) => {
    expectAndFail(data.input.id).toBe(stories[0].id);
    return {
      story: { ...stories[0], isClosed: false },
      clientMutationId: data.input.clientMutationId,
    };
  });
  const { tabPane } = await createTestRenderer({
    Query: {
      story: sinon.stub().returns({ ...stories[0], isClosed: true }),
    },
    Mutation: {
      openStory: openStoryStub,
    },
  });

  const button = within(tabPane).getByText("Open Stream", {
    selector: "button",
  });

  await act(async () => {
    button.props.onClick();
  });

  // Stream should then appear open.
  await waitForElement(() =>
    within(tabPane).getByText("Close Stream", {
      selector: "button",
    })
  );

  // Should have successfully sent with server.
  expect(openStoryStub.called).toBe(true);
});
