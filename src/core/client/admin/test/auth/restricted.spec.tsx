import { ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { LOCAL_ID } from "talk-framework/lib/relay";
import { GQLUSER_ROLE } from "talk-framework/schema";
import {
  createAccessToken,
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

function createTestRenderer(
  userDiff: any = {}
): {
  testRenderer: ReactTestRenderer;
  context: TalkContext;
} {
  replaceHistoryLocation("http://localhost/admin/moderate/reported");
  const resolvers = {
    Query: {
      settings: sinon.stub().returns(settings),
      moderationQueues: sinon.stub().returns(emptyModerationQueues),
      comments: sinon.stub().returns(emptyRejectedComments),
      viewer: sinon.stub().returns({ ...users[0], ...userDiff }),
    },
  };
  const { testRenderer, context } = create({
    resolvers,
    // Set this to true, to see graphql responses.
    logNetwork: false,
    initLocalState: localRecord => {
      localRecord.setValue(true, "loggedIn");
      localRecord.setValue(createAccessToken(), "accessToken");
      localRecord.setValue("SIGN_IN", "authView");
    },
  });
  return { testRenderer, context };
}

it("show restricted screen for commenters and staff", async () => {
  const restrictedRoles = [GQLUSER_ROLE.COMMENTER, GQLUSER_ROLE.STAFF];
  for (const role of restrictedRoles) {
    const { testRenderer } = createTestRenderer({ role });
    const authBox = await waitForElement(() =>
      within(testRenderer.root).getByTestID("authBox")
    );
    expect(within(authBox).toJSON()).toMatchSnapshot();
  }
});

it("show restricted screen when email is not set", async () => {
  const { testRenderer } = createTestRenderer({ email: "" });
  await waitForElement(() => within(testRenderer.root).getByTestID("authBox"));
});

it("show restricted screen when username is not set", async () => {
  const { testRenderer } = createTestRenderer({ username: "" });
  await waitForElement(() => within(testRenderer.root).getByTestID("authBox"));
});

it("show restricted screen local was not set (password)", async () => {
  const { testRenderer } = createTestRenderer({ profiles: [] });
  await waitForElement(() => within(testRenderer.root).getByTestID("authBox"));
});

it("sign out when clicking on sign in as", async () => {
  const { context, testRenderer } = createTestRenderer({
    role: GQLUSER_ROLE.COMMENTER,
  });
  const authBox = await waitForElement(() =>
    within(testRenderer.root).getByTestID("authBox")
  );

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/auth", {
      method: "DELETE",
    })
    .once()
    .returns({});

  within(authBox)
    .getByText("Sign in with a different account")
    .props.onClick();

  await wait(() => {
    expect(
      context.relayEnvironment
        .getStore()
        .getSource()
        .get(LOCAL_ID)!.redirectPath
    ).toBe("/admin/moderate/reported");
  });

  expect(
    context.relayEnvironment
      .getStore()
      .getSource()
      .get(LOCAL_ID)!.loggedIn
  ).toBeFalsy();
});
