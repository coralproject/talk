import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import sinon from "sinon";

import { ERROR_CODES } from "coral-common/errors";
import { pureMerge } from "coral-common/utils";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { GQLResolver } from "coral-framework/schema";
import {
  createAccessToken,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
import { settings, users } from "../fixtures";

const user = users.moderators[0];

const token = createAccessToken({ email: user.email! });

const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {}
) => {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  customRenderAppWithContext(context);
  return { context };
};

it("renders missing the token", async () => {
  replaceHistoryLocation("http://localhost/admin/invite");
  await createTestRenderer();
  const invalidLink = await screen.findByTestId("invalid-link");
  expect(invalidLink).toBeVisible();
  expect(
    within(invalidLink).getByText(
      "The specified link is invalid, check to see if it was copied correctly."
    )
  ).toBeVisible();
});

it("renders form", async () => {
  replaceHistoryLocation(`http://localhost/admin/invite#inviteToken=${token}`);
  const { context } = await createTestRenderer();
  const mock = sinon.mock(context.rest);

  mock
    .expects("fetch")
    .withArgs("/account/invite", {
      method: "GET",
      token,
    })
    .once();

  const inviteForm = await screen.findByTestId("invite-complete-form");
  expect(inviteForm).toBeVisible();
  expect(screen.getByText("You've been invited to join Coral")).toBeVisible();
  expect(screen.getByText("Finish setting up the account for:")).toBeVisible();
  expect(screen.getByRole("button", { name: "Create Account" })).toBeVisible();

  mock.verify();
});

it("renders error from server", async () => {
  replaceHistoryLocation(`http://localhost/admin/invite#inviteToken=${token}`);
  const codes = [
    ERROR_CODES.RATE_LIMIT_EXCEEDED,
    ERROR_CODES.INVITE_TOKEN_EXPIRED,
    ERROR_CODES.INTEGRATION_DISABLED,
    ERROR_CODES.USER_NOT_FOUND,
    ERROR_CODES.TOKEN_INVALID,
  ];

  for (const code of codes) {
    const { context } = await createTestRenderer();

    const mock = sinon.mock(context.rest);

    mock
      .expects("fetch")
      .withArgs("/account/invite", {
        method: "GET",
        token,
      })
      .once()
      .throwsException(
        new InvalidRequestError({
          code,
          traceID: "traceID",
        })
      );

    await screen.findByText(code, {
      exact: false,
    });

    mock.verify();
  }
});

it("submits form", async () => {
  replaceHistoryLocation(`http://localhost/admin/invite#inviteToken=${token}`);
  const { context } = await createTestRenderer();
  const mock = sinon.mock(context.rest);

  mock
    .expects("fetch")
    .withArgs("/account/invite", {
      method: "GET",
      token,
    })
    .once();

  mock
    .expects("fetch")
    .withArgs("/account/invite", {
      method: "PUT",
      token,
      body: {
        username: user.username!,
        password: "testtest",
      },
    })
    .once();

  expect(await screen.findByText(user.email!, { exact: false }));

  const usernameField = screen.getByLabelText("Username");
  const passwordField = screen.getByLabelText("Password");

  const createAccountButton = screen.getByRole("button", {
    name: "Create Account",
  });

  // Submit an empty form.
  userEvent.click(createAccountButton);
  expect(
    screen.getAllByText("field is required", { exact: false })
  ).toHaveLength(2);

  // Password too short.
  userEvent.type(usernameField, user.username!);
  userEvent.type(passwordField, "test");
  expect(
    screen.getByText("Password must contain at least 8 characters", {
      exact: false,
    })
  ).toBeVisible();

  // Submit valid form.
  userEvent.clear(passwordField);
  userEvent.type(passwordField, "testtest");
  userEvent.click(createAccountButton);
  expect(await screen.findByTestId("invite-complete-success")).toBeVisible();

  mock.verify();
});
