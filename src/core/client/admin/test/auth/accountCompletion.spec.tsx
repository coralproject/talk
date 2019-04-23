import { pureMerge } from "talk-common/utils";
import { GQLResolver } from "talk-framework/schema";
import {
  createAccessToken,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import create from "../create";
import { emptyModerationQueues, settings, users } from "../fixtures";

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  replaceHistoryLocation("http://localhost/admin/login");

  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () =>
            pureMerge<typeof viewer>(viewer, {
              email: "",
              username: "",
              profiles: [],
            }),
          moderationQueues: () => emptyModerationQueues,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("SIGN_IN", "authView");
      localRecord.setValue(true, "loggedIn");
      localRecord.setValue(createAccessToken(), "accessToken");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
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
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        viewer: () =>
          pureMerge<typeof viewer>(viewer, {
            email: "hans@test.com",
            username: "",
            profiles: [],
          }),
      },
    }),
  });
  await waitForElement(() => within(root).queryByText("Create Username"));
});

it("renders createPassword view", async () => {
  const { root } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        settings: () => settings,
        moderationQueues: () => emptyModerationQueues,
        viewer: () =>
          pureMerge<typeof viewer>(viewer, {
            email: "hans@test.com",
            username: "hans",
            profiles: [],
          }),
      },
    }),
  });
  await waitForElement(() => within(root).queryByText("Create Password"));
});

it("do not render createPassword view when local auth is disabled", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        viewer: () =>
          pureMerge<typeof viewer>(viewer, {
            email: "hans@test.com",
            username: "hans",
            profiles: [],
          }),
        settings: () =>
          pureMerge<typeof settings>(settings, {
            auth: {
              integrations: {
                local: {
                  enabled: false,
                },
              },
            },
          }),
      },
    }),
  });

  await wait(() =>
    expect(window.location.toString()).toBe(
      "http://localhost/admin/moderate/reported"
    )
  );
});

it("complete account", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        viewer: () =>
          pureMerge<typeof viewer>(viewer, {
            email: "hans@test.com",
            username: "hans",
            profiles: [{ __typename: "LocalProfile" }],
          }),
      },
    }),
  });
  await wait(() =>
    expect(window.location.toString()).toBe(
      "http://localhost/admin/moderate/reported"
    )
  );
});
