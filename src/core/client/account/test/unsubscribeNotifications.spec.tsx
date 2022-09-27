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
  return {
    context,
  };
}

it("renders missing confirm token", async () => {
  replaceHistoryLocation("http://localhost/account/notifications/unsubscribe");
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
    `http://localhost/account/notifications/unsubscribe#unsubscribeToken=${token}`
  );
  const { context } = await createTestRenderer();

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/account/notifications/unsubscribe", {
      method: "GET",
      token,
    })
    .once();

  const unsubscribeForm = await screen.findByTestId("unsubscribe-form");
  const unsubscribeTitle = screen.getByText(
    "Unsubscribe from email notifications"
  );
  const unsubscribeDescription = screen.getByText(
    "Click below to confirm that you want to unsubscribe from all notifications."
  );
  const unsubscribeButton = screen.getByRole("button", { name: "Unsubscribe" });
  expect(unsubscribeTitle).toBeVisible();
  expect(unsubscribeDescription).toBeVisible();
  expect(unsubscribeButton).toBeVisible();
  expect(await axe(unsubscribeForm)).toHaveNoViolations();
  restMock.verify();
});

it("renders error from server", async () => {
  replaceHistoryLocation(
    `http://localhost/account/notifications/unsubscribe#unsubscribeToken=${token}`
  );

  const codes = [
    ERROR_CODES.RATE_LIMIT_EXCEEDED,
    ERROR_CODES.INTEGRATION_DISABLED,
    ERROR_CODES.USER_NOT_FOUND,
    ERROR_CODES.TOKEN_INVALID,
  ];

  for (const code of codes) {
    const { context } = await createTestRenderer();

    const restMock = sinon.mock(context.rest);
    restMock
      .expects("fetch")
      .withArgs("/account/notifications/unsubscribe", {
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
    `http://localhost/account/notifications/unsubscribe#unsubscribeToken=${token}`
  );
  const { context } = await createTestRenderer();

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/account/notifications/unsubscribe", {
      method: "GET",
      token,
    })
    .once();

  restMock
    .expects("fetch")
    .withArgs("/account/notifications/unsubscribe", {
      method: "DELETE",
      token,
    })
    .once();

  const unsubscribeTitle = await screen.findByText(
    "Unsubscribe from email notifications"
  );
  expect(unsubscribeTitle).toBeVisible();
  const unsubscribeButton = screen.getByRole("button", { name: "Unsubscribe" });
  userEvent.click(unsubscribeButton);

  const success = await screen.findByText("successfully", { exact: false });
  expect(success).toBeVisible();

  restMock.verify();
});
