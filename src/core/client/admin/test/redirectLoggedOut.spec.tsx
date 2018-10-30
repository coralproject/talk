import { ReactTestRenderer } from "react-test-renderer";

import { timeout } from "talk-common/utils";
import { TalkContext } from "talk-framework/lib/bootstrap";
import { LOCAL_ID } from "talk-framework/lib/relay";
import create from "./create";

function createTestRenderer(): {
  testRenderer: ReactTestRenderer;
  context: TalkContext;
} {
  const previousState = window.history.state;
  window.history.replaceState(
    previousState,
    document.title,
    `http://localhost/admin/moderate`
  );

  const { testRenderer, context } = create({
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
  ).toBe("/admin/moderate");
  expect(window.location.toString()).toBe("http://localhost/admin/login");
});
