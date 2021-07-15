import sinon from "sinon";

import { ERROR_CODES } from "coral-common/errors";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createAccessToken,
  CreateTestRendererParams,
  replaceHistoryLocation,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "./create";

const token = createAccessToken();

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context } = create();
  return {
    context,
    testRenderer,
    root: testRenderer.root,
  };
}

it("renders missing reset token", async () => {
  replaceHistoryLocation("http://localhost/account/password/reset");
  const { root } = await createTestRenderer();
  await waitForElement(() => within(root).getByTestID("invalid-link"));
  expect(within(root).toJSON()).toMatchSnapshot();
  expect(await within(root).axe()).toHaveNoViolations();
});

it("renders form", async () => {
  replaceHistoryLocation(
    `http://localhost/account/password/reset#resetToken=${token}`
  );
  const { root, context } = await createTestRenderer();

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/auth/local/forgot", {
      method: "GET",
      token,
    })
    .once();

  await act(async () => {
    await waitForElement(() =>
      within(root).getByText("Reset your password", {
        exact: false,
      })
    );
  });
  expect(within(root).toJSON()).toMatchSnapshot();
  expect(await within(root).axe()).toHaveNoViolations();
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
    const { root, context } = await createTestRenderer();

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

    await act(async () => {
      await waitForElement(() =>
        within(root).getByText(code, {
          exact: false,
        })
      );
    });
    restMock.verify();
    expect(await within(root).axe()).toHaveNoViolations();
  }
});

it("submits form", async () => {
  replaceHistoryLocation(
    `http://localhost/account/password/reset#resetToken=${token}`
  );
  const { root, context } = await createTestRenderer();

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

  await act(async () => {
    await waitForElement(() =>
      within(root).getByText("Reset your password", {
        exact: false,
      })
    );
  });
  const form = within(root).getByType("form");
  const textField = within(root).getByLabelText("Password");

  // Submit an empty form.
  act(() => {
    form.props.onSubmit();
  });
  within(root).getByText("field is required", {
    exact: false,
  });

  // Password too short.
  act(() => {
    textField.props.onChange("test");
  });
  within(root).getByText("Password must contain at least 8 characters", {
    exact: false,
  });

  // Submit valid form.
  await act(async () => {
    textField.props.onChange("testtest");
    form.props.onSubmit();
    await waitForElement(() =>
      within(root).getByText("successfully", {
        exact: false,
      })
    );
  });

  restMock.verify();
});
