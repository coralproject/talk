import { act, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import sinon from "sinon";

import customRenderAppWithContext from "../customRenderAppWithContext";
import { moderators, settings, stories } from "../fixtures";
import { createContext } from "./create";

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

it("renders configure", async () => {
  await act(async () => {
    await createTestRenderer();
  });
  const tabPane = await screen.findByTestId("current-tab-pane");

  expect(tabPane).toMatchSnapshot();
  expect(await axe(tabPane)).toHaveNoViolations();
});
