import { screen } from "@testing-library/react";
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

  return { context };
}

it("renders missing confirm token", async () => {
  replaceHistoryLocation("http://localhost/account/email/confirm");
  await createTestRenderer();
  const invalidLink = await screen.findByTestId("invalid-link");
  const invalidLinkText = screen.getByText(
    "The specified link is invalid, check to see if it was copied correctly."
  );
  const invalidLinkHeader = screen.getByText("Oops Sorry!");
  expect(invalidLinkText).toBeVisible();
  expect(invalidLinkHeader).toBeVisible();
  expect(await axe(invalidLink)).toHaveNoViolations();
});

it("renders form", async () => {
  replaceHistoryLocation(
    `http://localhost/account/email/confirm#confirmToken=${token}`
  );
  const { context } = await createTestRenderer();

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/account/confirm", {
      method: "GET",
      token,
    })
    .once();

  const confirmTitle = await screen.findByText("Confirm your email address");
  const confirmDescription = screen.getByText(
    "Click below to confirm your email address."
  );
  const confirmButton = screen.getByRole("button", { name: "Confirm email" });

  expect(confirmTitle).toBeVisible();
  expect(confirmDescription).toBeVisible();
  expect(confirmButton).toBeVisible();

  const mainLayout = screen.getByTestId("main-layout");
  expect(await axe(mainLayout)).toHaveNoViolations();

  restMock.verify();
});

it("renders error from server", async () => {
  replaceHistoryLocation(
    `http://localhost/account/email/confirm#confirmToken=${token}`
  );

  const codes = [
    ERROR_CODES.RATE_LIMIT_EXCEEDED,
    ERROR_CODES.EMAIL_CONFIRM_TOKEN_EXPIRED,
    ERROR_CODES.INTEGRATION_DISABLED,
    ERROR_CODES.USER_NOT_FOUND,
    ERROR_CODES.TOKEN_INVALID,
  ];

  for (const code of codes) {
    const { context } = await createTestRenderer();

    const restMock = sinon.mock(context.rest);
    restMock
      .expects("fetch")
      .withArgs("/account/confirm", {
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
    `http://localhost/account/email/confirm#confirmToken=${token}`
  );
  const { context } = await createTestRenderer();

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/account/confirm", {
      method: "GET",
      token,
    })
    .once();

  restMock
    .expects("fetch")
    .withArgs("/account/confirm", {
      method: "PUT",
      token,
    })
    .once();

  const confirmEmailTitle = await screen.findByText(
    "Confirm your email address"
  );
  expect(confirmEmailTitle).toBeVisible();
  const confirmEmail = screen.getByRole("button", { name: "Confirm email" });
  userEvent.click(confirmEmail);

  const success = await screen.findByText("successfully", { exact: false });
  expect(success).toBeVisible();

  restMock.verify();
});
