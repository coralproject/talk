import sinon from "sinon";

import { LOCAL_ID } from "talk-framework/lib/relay";
import {
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  settings,
  users,
} from "../fixtures";

const resolvers = {
  Query: {
    settings: sinon.stub().returns(settings),
    moderationQueues: sinon.stub().returns(emptyModerationQueues),
    comments: sinon.stub().returns(emptyRejectedComments),
    viewer: sinon.stub().returns(users.admins[0]),
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
    .withArgs("/auth", {
      method: "DELETE",
    })
    .once()
    .returns({});

  const userMenu = await waitForElement(() =>
    within(testRenderer.root).getByText(users.admins[0].username!, {
      selector: "button",
    })
  );

  userMenu.props.onClick();

  const signOutButton = await waitForElement(() =>
    within(testRenderer.root).getByText("Sign Out")
  );
  signOutButton.props.onClick();

  await wait(() => {
    expect(
      context.relayEnvironment
        .getStore()
        .getSource()
        .get(LOCAL_ID)!.loggedIn
    ).toBeFalsy();
  });
});
