import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createAccessToken,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
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

  const { context } = createContext({
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

  customRenderAppWithContext(context);
}

it("renders addEmailAddress view", async () => {
  await createTestRenderer();

  const emailAddressTextField = await screen.findByRole("textbox", {
    name: "Email Address",
  });
  const addEmailAddressButton = screen.getByRole("button", {
    name: "Add Email Address",
  });
  expect(emailAddressTextField).toBeVisible();
  expect(addEmailAddressButton).toBeVisible();
});

it("renders createUsername view", async () => {
  await createTestRenderer({
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

  const usernameTextField = await screen.findByRole("textbox", {
    name: "Username",
  });
  const createUsernameButton = screen.getByRole("button", {
    name: "Create Username",
  });
  expect(usernameTextField).toBeVisible();
  expect(createUsernameButton).toBeVisible();
});

it("renders createPassword view", async () => {
  await createTestRenderer({
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

  const createPasswordButton = await screen.findByRole("button", {
    name: "Create Password",
  });
  expect(createPasswordButton).toBeVisible();
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

  await screen.findByText("Coral");

  await waitFor(() => {
    expect(window.location.toString()).toBe(
      "http://localhost/admin/moderate/reported"
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
  await screen.findByText("Coral");

  await waitFor(() =>
    expect(window.location.toString()).toBe(
      "http://localhost/admin/moderate/reported"
    )
  );
});

it("renders account linking view", async () => {
  await createTestRenderer({
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
  const linkAccountContainer = await screen.findByTestId(
    "linkAccount-container"
  );
  expect(linkAccountContainer).toBeVisible();
});

it("renders account linking view, but then switch to add email view", async () => {
  await createTestRenderer({
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
  const linkAccountContainer = await screen.findByTestId(
    "linkAccount-container"
  );
  expect(linkAccountContainer).toBeVisible();

  const button = screen.getByRole("button", {
    name: "Use a different email address",
  });
  userEvent.click(button);

  const emailAddressTextField = await screen.findByRole("textbox", {
    name: "Email Address",
  });
  const addEmailAddressButton = screen.getByRole("button", {
    name: "Add Email Address",
  });
  expect(emailAddressTextField).toBeVisible();
  expect(addEmailAddressButton).toBeVisible();
});
