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

it("renders missing confirm token", async () => {
  replaceHistoryLocation("http://localhost/account/notifications/unsubscribe");
  const { root } = await createTestRenderer();
  await waitForElement(() => within(root).getByTestID("invalid-link"));
  expect(within(root).toJSON()).toMatchSnapshot();
  expect(await within(root).axe()).toHaveNoViolations();
});

it("renders form", async () => {
  replaceHistoryLocation(
    `http://localhost/account/notifications/unsubscribe#unsubscribeToken=${token}`
  );
  const { root, context } = await createTestRenderer();

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/account/notifications/unsubscribe", {
      method: "GET",
      token,
    })
    .once();

  await act(async () => {
    await waitForElement(() => within(root).getByTestID("unsubscribe-form"));
  });
  expect(within(root).toJSON()).toMatchSnapshot();
  expect(await within(root).axe()).toHaveNoViolations();
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
    const { root, context } = await createTestRenderer();

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
    `http://localhost/account/notifications/unsubscribe#unsubscribeToken=${token}`
  );
  const { root, context } = await createTestRenderer();

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

  await act(async () => {
    await waitForElement(() => within(root).getByTestID("unsubscribe-form"));
  });
  const form = within(root).getByType("form");

  // Submit valid form.
  await act(async () => {
    form.props.onSubmit();
    await waitForElement(() => within(root).getByTestID("success"));
  });

  restMock.verify();
});
