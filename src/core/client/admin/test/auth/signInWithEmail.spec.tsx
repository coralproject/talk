import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import sinon from "sinon";

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
  emptyRejectedComments,
  settings,
  siteConnection,
} from "../fixtures";

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  // deliberately setting to a different route,
  // it should be smart enough to reroute to /admin/login.
  replaceHistoryLocation("http://localhost/admin/moderate");

  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          moderationQueues: () => emptyModerationQueues,
          comments: () => emptyRejectedComments,
          sites: () => siteConnection,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("SIGN_IN", "authView");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });

  customRenderAppWithContext(context);
  return { context };
}

it("renders sign in form", async () => {
  await createTestRenderer();

  expect(
    await screen.findByRole("textbox", { name: "Email Address" })
  ).toBeVisible();
  expect(
    screen.getByRole("button", { name: "Sign in with Email" })
  ).toBeVisible();
  expect(screen.getByText("Sign in to")).toBeVisible();
});

it("shows error when submitting empty form", async () => {
  await createTestRenderer();
  const signInButton = await screen.findByRole("button", {
    name: "Sign in with Email",
  });
  userEvent.click(signInButton);

  expect(screen.getAllByText("This field is required.")).toHaveLength(2);
});

it("checks for invalid email", async () => {
  await createTestRenderer();

  const emailField = await screen.findByRole("textbox", {
    name: "Email Address",
  });
  userEvent.type(emailField, "invalid-email");
  const signInButton = await screen.findByRole("button", {
    name: "Sign in with Email",
  });
  userEvent.click(signInButton);

  expect(screen.getByText("Please enter a valid email address.")).toBeVisible();
});

it("accepts valid email", async () => {
  await createTestRenderer();

  const emailField = await screen.findByRole("textbox", {
    name: "Email Address",
  });
  fireEvent.change(emailField, { target: { value: "hans@test.com" } });

  const signInButton = screen.getByRole("button", {
    name: "Sign in with Email",
  });
  userEvent.click(signInButton);

  await waitFor(() => {
    expect(
      screen.queryByText("Please enter a valid email address.")
    ).toBeNull();
  });
});

it("accepts correct password", async () => {
  await createTestRenderer();

  const passwordField = await screen.findByLabelText("Password");
  userEvent.type(passwordField, "testtest");

  const signInButton = screen.getByRole("button", {
    name: "Sign in with Email",
  });
  userEvent.click(signInButton);

  expect(screen.getAllByText("This field is required.")).toHaveLength(1);
});

it("shows server error", async () => {
  const { context } = await createTestRenderer();

  const emailField = await screen.findByRole("textbox", {
    name: "Email Address",
  });
  fireEvent.change(emailField, { target: { value: "hans@test.com" } });
  const passwordField = await screen.findByLabelText("Password");
  fireEvent.change(passwordField, { target: { value: "testtest" } });

  const error = new Error("Server Error");
  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/auth/local", {
      method: "POST",
      body: {
        email: "hans@test.com",
        password: "testtest",
      },
    })
    .once()
    .throws(error);

  const signInButton = screen.getByRole("button", {
    name: "Sign in with Email",
  });
  userEvent.click(signInButton);

  expect(signInButton).toBeDisabled();

  await waitFor(() => {
    expect(signInButton).toBeEnabled();
  });

  expect(screen.getByText("Server Error"));
  restMock.verify();
});

it("submits form successfully", async () => {
  const { context } = await createTestRenderer();
  const emailField = await screen.findByRole("textbox", {
    name: "Email Address",
  });
  fireEvent.change(emailField, { target: { value: "hans@test.com" } });
  const passwordField = await screen.findByLabelText("Password");
  fireEvent.change(passwordField, { target: { value: "testtest" } });

  const accessToken = createAccessToken();

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/auth/local", {
      method: "POST",
      body: {
        email: "hans@test.com",
        password: "testtest",
      },
    })
    .once()
    .returns({ token: accessToken });

  const historyMock = sinon.mock(window.history);

  const signInButton = screen.getByRole("button", {
    name: "Sign in with Email",
  });
  userEvent.click(signInButton);
  expect(signInButton).toBeDisabled();

  await waitFor(() => {
    expect(signInButton).toBeEnabled();
  });

  expect(location.toString()).toEqual("http://localhost/admin/login");
  restMock.verify();
  historyMock.verify();
});
