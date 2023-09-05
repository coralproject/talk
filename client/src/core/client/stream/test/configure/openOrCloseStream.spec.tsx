import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import sinon from "sinon";

import customRenderAppWithContext from "../customRenderAppWithContext";
import { moderators, settings, stories } from "../fixtures";
import { createContext } from "./create";

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

  const { context } = createContext({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(stories[0].id, "storyID");
    },
  });

  customRenderAppWithContext(context);

  return;
}

it("close stream", async () => {
  const closeStoryStub = sinon.stub().callsFake((_: any, data: any) => {
    expectAndFail(data.input.id).toBe(stories[0].id);
    return {
      story: { ...stories[0], isClosed: true },
      clientMutationId: data.input.clientMutationId,
    };
  });
  await act(async () => {
    await createTestRenderer({
      Mutation: {
        closeStory: closeStoryStub,
      },
    });
  });

  const tabPane = await screen.findByTestId("current-tab-pane");

  const closeButton = within(tabPane).getByRole("button", {
    name: "Close Stream",
  });
  userEvent.click(closeButton);

  expect(
    await within(tabPane).findByRole("button", { name: "Open Stream" })
  ).toBeVisible();

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

  await act(async () => {
    await createTestRenderer({
      Query: {
        story: sinon.stub().returns({ ...stories[0], isClosed: true }),
      },
      Mutation: {
        openStory: openStoryStub,
      },
    });
  });

  const tabPane = await screen.findByTestId("current-tab-pane");

  const button = within(tabPane).getByRole("button", { name: "Open Stream" });

  userEvent.click(button);

  // Stream should then appear open.
  expect(
    await within(tabPane).findByRole("button", {
      name: "Close Stream",
    })
  ).toBeVisible();

  // Should have successfully sent with server.
  expect(openStoryStub.called).toBe(true);
});
