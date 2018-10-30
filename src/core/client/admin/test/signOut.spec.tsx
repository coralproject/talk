import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { LOCAL_ID } from "talk-framework/lib/relay";

import create from "./create";

it("logs out", async () => {
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
