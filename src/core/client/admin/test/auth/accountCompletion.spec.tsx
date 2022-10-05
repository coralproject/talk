import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createAccessToken,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  settings,
  siteConnection,
  users,
} from "../fixtures";

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  replaceHistoryLocation("http://localhost/admin/login");

  return act(() => {
    const { testRenderer, context } = create({
      ...params,
      resolvers: pureMerge(
        createResolversStub<GQLResolver>({
          Query: {
            sites: () => siteConnection,
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
        localRecord.setValue(createAccessToken(), "accessToken");
        localRecord.setValue("SIGN_IN", "authView");
        if (params.initLocalState) {
          params.initLocalState(localRecord, source, environment);
        }
      },
    });

    return {
      context,
      testRenderer,
    };
  });
}

it("renders addEmailAddress view", async () => {
  const { testRenderer } = await createTestRenderer();
  await waitForElement(() =>
    within(testRenderer.root).queryByText("Add Email Address")
  );
});

it("renders createUsername view", async () => {
  const { testRenderer } = await createTestRenderer({
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
  await waitForElement(() =>
    within(testRenderer.root).queryByText("Create Username")
  );
});

it("renders createPassword view", async () => {
  const { testRenderer } = await createTestRenderer({
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
  await waitForElement(() =>
    within(testRenderer.root).queryByText("Create Password")
  );
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

  await act(async () => {
    await wait(() =>
      expect(window.location.toString()).toBe(
        "http://localhost/admin/moderate/reported"
      )
    );
  });
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
  await act(async () => {
    await wait(() =>
      expect(window.location.toString()).toBe(
        "http://localhost/admin/moderate/reported"
      )
    );
  });
});

it("renders account linking view", async () => {
  const { testRenderer } = await createTestRenderer({
    resolvers: {
      Query: {
        viewer: () =>
          pureMerge<typeof viewer>(viewer, {
            email: "",
            username: "hans",
            duplicateEmail: "my@email.com",
          }),
      },
    },
  });
  await act(async () => {
    await waitForElement(() =>
      within(testRenderer.root).getByTestID("linkAccount-container")
    );
  });
});

it("renders account linking view, but then switch to add email view", async () => {
  const { testRenderer } = await createTestRenderer({
    resolvers: {
      Query: {
        viewer: () =>
          pureMerge<typeof viewer>(viewer, {
            email: "",
            username: "hans",
            duplicateEmail: "my@email.com",
          }),
      },
    },
  });
  await act(async () => {
    await waitForElement(() =>
      within(testRenderer.root).getByTestID("linkAccount-container")
    );
  });
  const button = await waitForElement(() =>
    within(testRenderer.root).getByText("Use a different email address")
  );
  await act(async () => {
    button.props.onClick();
    await waitForElement(() =>
      within(testRenderer.root).queryByText("Add Email Address")
    );
  });
});
