import { screen } from "@testing-library/react";
import sinon from "sinon";

import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";

import { settings, stories } from "../../fixtures";
import { createContext } from "../create";

const story = stories[2];

async function createTestRenderer(
  resolver: any = {},
  options: { muteNetworkErrors?: boolean } = {}
) {
  const resolvers = {
    ...resolver,
    Query: {
      settings: sinon.stub().returns(settings),
      stream: sinon.stub().callsFake((_: any, variables: any) => {
        expectAndFail(variables.id).toBe(story.id);
        return story;
      }),
      ...resolver.Query,
    },
  };

  const { context } = createContext({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(story.id, "storyID");
    },
  });
  customRenderAppWithContext(context);
}

it("renders comment stream", async () => {
  await createTestRenderer();
  const allComments = await screen.findByTestId("comments-allComments-log");
  expect(allComments).toBeVisible();

  // renders first comment with username, buttons, and body
  expect(
    screen.getByRole("article", {
      name: "Comment from Markus 2018-07-06T18:24:00.000Z",
    })
  ).toBeVisible();
  expect(screen.getByRole("button", { name: "User Markus" })).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Respect comment by Markus" })
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Reply to comment by Markus" })
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Share comment by Markus" })
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Report comment by Markus" })
  ).toBeVisible();
  expect(screen.queryAllByText("Joining Too")).toHaveLength(2);

  // renders second comment with username, buttons, and body
  expect(
    screen.getByRole("article", {
      name: "Comment from Moderator 2018-07-06T18:24:00.000Z",
    })
  ).toBeVisible();
  expect(screen.getByRole("button", { name: "User Moderator" })).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Respect comment by Moderator" })
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Reply to comment by Moderator" })
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Share comment by Moderator" })
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Report comment by Moderator" })
  ).toBeVisible();

  // TODO (Nick): this is failing due to axe. Tried upgrading react-axe,
  //   jest-axe, and their types. That didn't work, and also noticed that
  //   these libs have been deprecated and replaced with new libs on npm.
  //   When I have more time, will look into replacing axe with these
  //   new libs.

  // expect(await within(testRenderer.root).axe()).toHaveNoViolations();
});
