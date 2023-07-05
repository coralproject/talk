import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import sinon from "sinon";

import { ERROR_CODES } from "coral-common/errors";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { GQLResolver } from "coral-framework/schema";
import {
  createAccessToken,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "./create";
import customRenderAppWithContext from "./customRenderAppWithContext";

const token = createAccessToken();

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = createContext();
  customRenderAppWithContext(context);
  return {
    context,
  };
}

it("renders missing reset token", async () => {
  replaceHistoryLocation("http://localhost/account/password/reset");
  await createTestRenderer();
  const invalidLink = await screen.findByTestId("invalid-link");
  expect(invalidLink).toBeVisible();
  const invalidLinkText = within(invalidLink).getByText(
    "The specified link is invalid, check to see if it was copied correctly."
  );
  expect(invalidLinkText).toBeVisible();
  expect(await axe(invalidLink)).toHaveNoViolations();
});

it("renders form", async () => {
  replaceHistoryLocation(
    `http://localhost/account/password/reset#resetToken=${token}`
  );
  const { context } = await createTestRenderer();

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/auth/local/forgot", {
      method: "GET",
      token,
    })
    .once();

  const resetPasswordTitle = await screen.findByText("Reset your password");
  const resetPasswordDescription = screen.getByText(
    "Please enter a new password to use to sign in to your account. Make sure it is unique and be sure to keep it secure."
  );
  const resetPasswordButton = screen.getByRole("button", {
    name: "Reset Password",
  });
  expect(resetPasswordTitle).toBeVisible();
  expect(resetPasswordDescription).toBeVisible();
  expect(resetPasswordButton).toBeVisible();
  restMock.verify();
});

it("renders error from server", async () => {
  replaceHistoryLocation(
    `http://localhost/account/password/reset#resetToken=${token}`
  );

  const codes = [
    ERROR_CODES.RATE_LIMIT_EXCEEDED,
    ERROR_CODES.PASSWORD_RESET_TOKEN_EXPIRED,
    ERROR_CODES.INTEGRATION_DISABLED,
    ERROR_CODES.USER_NOT_FOUND,
    ERROR_CODES.TOKEN_INVALID,
  ];

  for (const code of codes) {
    const { context } = await createTestRenderer();

    const restMock = sinon.mock(context.rest);
    restMock
      .expects("fetch")
      .withArgs("/auth/local/forgot", {
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
    restMock.verify();
  }
});

it("submits form", async () => {
  replaceHistoryLocation(
    `http://localhost/account/password/reset#resetToken=${token}`
  );
  const { context } = await createTestRenderer();

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/auth/local/forgot", {
      method: "GET",
      token,
    })
    .once();

  restMock
    .expects("fetch")
    .withArgs("/auth/local/forgot", {
      method: "PUT",
      token,
      body: {
        password: "testtest",
      },
    })
    .once();

  await screen.findByText("Reset your password");
  const resetPasswordButton = screen.getByRole("button", {
    name: "Reset Password",
  });
  const textField = screen.getByLabelText("Password");

  // Submit an empty form.
  userEvent.click(resetPasswordButton);
  screen.getByText("field is required", {
    exact: false,
  });

  // Password too short.
  userEvent.type(textField, "test");
  expect(
    screen.getByText("Password must contain at least 8 characters", {
      exact: false,
    })
  ).toBeVisible();

  // Submit valid form.
  userEvent.clear(textField);
  userEvent.type(textField, "testtest");
  userEvent.click(resetPasswordButton);

  await waitFor(() =>
    expect(
      screen.getByText("successfully", {
        exact: false,
      })
    ).toBeVisible()
  );

  restMock.verify();
});
