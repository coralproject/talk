import { get, merge } from "lodash";
import sinon from "sinon";

import {
  createAuthToken,
  wait,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import create from "./create";
import { settings } from "./fixtures";
import mockWindow from "./mockWindow";

let windowMock: ReturnType<typeof mockWindow>;

const authToken = createAuthToken();

async function createTestRenderer(
  customResolver: any = {},
  options: { muteNetworkErrors?: boolean; logNetwork?: boolean } = {}
) {
  const resolvers = {
    ...customResolver,
    Query: {
      ...customResolver.Query,
      settings: sinon
        .stub()
        .returns(merge({}, settings, get(customResolver, "Query.settings"))),
      me: sinon
        .stub()
        .returns(
          merge({ id: "me", profiles: [] }, get(customResolver, "Query.me"))
        ),
    },
  };

  const { testRenderer, context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: options.logNetwork,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue("CREATE_PASSWORD", "view");
      localRecord.setValue(authToken, "authToken");
    },
  });

  return {
    context,
    testRenderer,
    root: testRenderer.root,
  };
}

beforeEach(async () => {
  windowMock = mockWindow();
});

afterEach(async () => {
  await wait(() => expect(windowMock.resizeStub.called).toBe(true));
  windowMock.restore();
});

it("renders addEmailAddress view", async () => {
  const { root } = await createTestRenderer();
  await waitForElement(() =>
    within(root).getByTestID("addEmailAddress-container")
  );
});

it("renders createUsername view", async () => {
  const { root } = await createTestRenderer({
    Query: {
      me: {
        email: "hans@test.com",
      },
    },
  });
  await waitForElement(() =>
    within(root).getByTestID("createUsername-container")
  );
});

it("renders createPassword view", async () => {
  const { root } = await createTestRenderer({
    Query: {
      me: {
        email: "hans@test.com",
        username: "hans",
      },
    },
  });
  await waitForElement(() =>
    within(root).getByTestID("createPassword-container")
  );
});

it("send back auth token", async () => {
  const { context } = await createTestRenderer({
    Query: {
      me: {
        email: "hans@test.com",
        username: "hans",
        profiles: [{ __typename: "LocalProfile" }],
      },
    },
  });

  const postMessageMock = sinon.mock(context.postMessage);
  postMessageMock
    .expects("send")
    .withArgs("setAuthToken", authToken, window.opener)
    .atLeast(1);

  // Wait till window is closed.
  await wait(() => expect(windowMock.closeStub.called).toBe(true));

  postMessageMock.verify();
});
