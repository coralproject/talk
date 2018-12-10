import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { LOCAL_ID } from "talk-framework/lib/relay";
import { replaceHistoryLocation } from "talk-framework/testHelpers";

import create from "./create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  settings,
} from "./fixtures";

const resolvers = {
  Query: {
    settings: sinon.stub().returns(settings),
    moderationQueues: sinon.stub().returns(emptyModerationQueues),
    comments: sinon.stub().returns(emptyRejectedComments),
  },
};

it("logs out", async () => {
  replaceHistoryLocation("http://localhost/admin/moderate");

  const { testRenderer, context } = create({
    resolvers,
    // Set this to true, to see graphql responses.
    logNetwork: false,
    initLocalState: localRecord => {
      localRecord.setValue(true, "loggedIn");
    },
  });

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/tenant/auth", {
      method: "DELETE",
    })
    .once()
    .returns({});

  await timeout();
  testRenderer.root
    .find(i => i.props.id === "navigation-signOutButton" && i.props.onClick)
    .props.onClick();

  await timeout();

  expect(
    context.relayEnvironment
      .getStore()
      .getSource()
      .get(LOCAL_ID)!.loggedIn
  ).toBeFalsy();
});
