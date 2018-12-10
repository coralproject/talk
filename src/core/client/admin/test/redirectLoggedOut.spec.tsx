import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { TalkContext } from "talk-framework/lib/bootstrap";
import { LOCAL_ID } from "talk-framework/lib/relay";
import { replaceHistoryLocation } from "talk-framework/testHelpers";

import create from "./create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  settings,
} from "./fixtures";

function createTestRenderer(): {
  testRenderer: ReactTestRenderer;
  context: TalkContext;
} {
  replaceHistoryLocation("http://localhost/admin/moderate");
  const resolvers = {
    Query: {
      settings: sinon.stub().returns(settings),
      moderationQueues: sinon.stub().returns(emptyModerationQueues),
      comments: sinon.stub().returns(emptyRejectedComments),
    },
  };
  const { testRenderer, context } = create({
    resolvers,
    // Set this to true, to see graphql responses.
    logNetwork: false,
    initLocalState: localRecord => {
      localRecord.setValue(false, "loggedIn");
    },
  });
  return { testRenderer, context };
}

it("redirect when not logged in", async () => {
  const { context } = createTestRenderer();
  await timeout();
  expect(
    context.relayEnvironment
      .getStore()
      .getSource()
      .get(LOCAL_ID)!.redirectPath
  ).toBe("/admin/moderate/reported");
  expect(window.location.toString()).toBe("http://localhost/admin/login");
});
