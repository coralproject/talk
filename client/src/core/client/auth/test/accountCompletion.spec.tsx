import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import sinon from "sinon";

import { pureMerge } from "coral-common/common/lib/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createAccessToken,
  createResolversStub,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

import { createContext } from "./create";
import customRenderAppWithContext from "./customRenderAppWithContext";
import { settings } from "./fixtures";
import mockWindow from "./mockWindow";

let windowMock: ReturnType<typeof mockWindow>;

const accessToken = createAccessToken();
const viewer = { id: "me", profiles: [] };

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("CREATE_PASSWORD", "view");
      localRecord.setValue(accessToken, "accessToken");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  customRenderAppWithContext(context);
  return {
    context,
  };
}

beforeEach(async () => {
  windowMock = mockWindow();
});

afterEach(async () => {
  windowMock.restore();
});

it("renders addEmailAddress view", async () => {
  await createTestRenderer();
  const addEmailAddressContainer = await screen.findByTestId(
    "addEmailAddress-container"
  );
  expect(addEmailAddressContainer).toBeVisible();
});

it("renders createUsername view", async () => {
  await createTestRenderer({
    resolvers: {
      Query: {
        viewer: () =>
          pureMerge(viewer, {
            email: "hans@test.com",
          }),
      },
    },
  });
  const usernameTextField = await screen.findByRole("textbox", {
    name: "Username",
  });
  const createUsernameButton = screen.getByRole("button", {
    name: "Create username",
  });
  expect(usernameTextField).toBeVisible();
  expect(createUsernameButton).toBeVisible();
});

it("renders createPassword view", async () => {
  await createTestRenderer({
    resolvers: {
      Query: {
        viewer: () =>
          pureMerge(viewer, {
            email: "hans@test.com",
            username: "hans",
          }),
      },
    },
  });
  const createPasswordTitle = await screen.findByText("Create a password");
  const createPasswordDescription = screen.getByText(
    "To protect against unauthorized changes to your account, we require users to create a password."
  );
  const createPasswordButton = screen.getByRole("button", {
    name: "Create password",
  });
  expect(createPasswordTitle).toBeVisible();
  expect(createPasswordDescription).toBeVisible();
  expect(createPasswordButton).toBeVisible();
});

it("renders account linking view", async () => {
  await createTestRenderer({
    resolvers: {
      Query: {
        viewer: () =>
          pureMerge(viewer, {
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
  const email = screen.getByText("my@email.com", { exact: false });
  expect(email).toBeVisible();
});

it("renders account linking view, but then switch to add email view", async () => {
  await createTestRenderer({
    resolvers: {
      Query: {
        viewer: () =>
          pureMerge(viewer, {
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
    name: "Email address",
  });
  const addEmailAddressButton = screen.getByRole("button", {
    name: "Add email address",
  });
  expect(emailAddressTextField).toBeVisible();
  expect(addEmailAddressButton).toBeVisible();
});

it("do not render createPassword view when local auth is disabled", async () => {
  await createTestRenderer({
    resolvers: {
      Query: {
        viewer: () =>
          pureMerge(viewer, {
            email: "hans@test.com",
            username: "hans",
          }),

        settings: () =>
          pureMerge(settings, {
            auth: {
              integrations: {
                local: {
                  enabled: false,
                },
              },
            },
          }),
      },
    },
  });
  // Wait till window is closed.
  await waitFor(() => expect(windowMock.closeStub.called).toBe(true));
});

it("send back access token", async () => {
  // The popup was opened by the page, so it has an opener to post to.
  // eslint-disable-next-line no-restricted-globals
  const originalOpener = window.opener;
  // eslint-disable-next-line no-restricted-globals
  window.opener = window;
  const { context } = await createTestRenderer({
    resolvers: {
      Query: {
        viewer: () =>
          pureMerge(viewer, {
            email: "hans@test.com",
            username: "hans",
            profiles: [{ __typename: "LocalProfile" }],
          }),
      },
    },
  });

  const postMessageMock = sinon.mock(context.postMessage);
  postMessageMock
    .expects("send")
    .withArgs("setAccessToken", accessToken, window.opener)
    .atLeast(1);

  // Wait till window is closed.
  await waitFor(() => expect(windowMock.closeStub.called).toBe(true));

  postMessageMock.verify();
  // eslint-disable-next-line no-restricted-globals
  window.opener = originalOpener;
});

it("hands off the access token through the server without an opener", async () => {
  // eslint-disable-next-line no-restricted-globals
  const originalOpener = window.opener;
  // eslint-disable-next-line no-restricted-globals
  window.opener = null;
  try {
    const { context } = createContext({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () =>
            pureMerge(viewer, {
              email: "hans@test.com",
              username: "hans",
              profiles: [{ __typename: "LocalProfile" }],
            }),
        },
      }),
      initLocalState: (localRecord) => {
        localRecord.setValue("CREATE_PASSWORD", "view");
        localRecord.setValue(accessToken, "accessToken");
      },
    });
    // The popup remembered this ID before it navigated away to sign in.
    await context.sessionStorage.setItem("authHandoff", "handoff-id");

    const postMessageMock = sinon.mock(context.postMessage);
    postMessageMock.expects("send").never();
    const fetchStub = sinon.stub(context.rest, "fetch").resolves("");

    customRenderAppWithContext(context);

    await waitFor(() => expect(windowMock.closeStub.called).toBe(true));

    postMessageMock.verify();
    expect(
      fetchStub.calledWithMatch("/auth/handoff", {
        method: "POST",
        body: { id: "handoff-id" },
        token: accessToken,
      })
    ).toBe(true);
  } finally {
    // eslint-disable-next-line no-restricted-globals
    window.opener = originalOpener;
  }
});
