import { get, merge } from "lodash";
import sinon from "sinon";

import {
  createAccessToken,
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import create from "../create";
import { emptyModerationQueues, settings, users } from "../fixtures";

async function createTestRenderer(
  customResolver: any = {},
  options: { muteNetworkErrors?: boolean; logNetwork?: boolean } = {}
) {
  replaceHistoryLocation("http://localhost/admin/login");
  const resolvers = {
    ...customResolver,
    Query: {
      ...customResolver.Query,
      moderationQueues: sinon.stub().returns(emptyModerationQueues),
      settings: sinon
        .stub()
        .returns(merge({}, settings, get(customResolver, "Query.settings"))),
      viewer: sinon
        .stub()
        .returns(
          merge(
            { ...users.admins[0], email: "", username: "", profiles: [] },
            get(customResolver, "Query.viewer")
          )
        ),
    },
  };

  const { testRenderer, context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: options.logNetwork,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue("SIGN_IN", "authView");
      localRecord.setValue(true, "loggedIn");
      localRecord.setValue(createAccessToken(), "accessToken");
    },
  });

  return {
    context,
    testRenderer,
    root: testRenderer.root,
  };
}

it("renders addEmailAddress view", async () => {
  const { root } = await createTestRenderer();
  await waitForElement(() => within(root).queryByText("Add Email Address"));
});

it("renders createUsername view", async () => {
  const { root } = await createTestRenderer({
    Query: {
      viewer: {
        email: "hans@test.com",
      },
    },
  });
  await waitForElement(() => within(root).queryByText("Create Username"));
});

it("renders createPassword view", async () => {
  const { root } = await createTestRenderer({
    Query: {
      viewer: {
        email: "hans@test.com",
        username: "hans",
      },
    },
  });
  await waitForElement(() => within(root).queryByText("Create Password"));
});

it("do not render createPassword view when local auth is disabled", async () => {
  await createTestRenderer({
    Query: {
      viewer: {
        email: "hans@test.com",
        username: "hans",
      },
      settings: {
        auth: {
          integrations: {
            local: {
              enabled: false,
            },
          },
        },
      },
    },
  });

  await wait(() =>
    expect(window.location.toString()).toBe(
      "http://localhost/admin/moderate/reported"
    )
  );
});

it("complete account", async () => {
  await createTestRenderer({
    Query: {
      viewer: {
        email: "hans@test.com",
        username: "hans",
        profiles: [{ __typename: "LocalProfile" }],
      },
    },
  });
  await wait(() =>
    expect(window.location.toString()).toBe(
      "http://localhost/admin/moderate/reported"
    )
  );
});
