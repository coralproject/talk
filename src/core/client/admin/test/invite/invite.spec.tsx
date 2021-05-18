import sinon from "sinon";

import { ERROR_CODES } from "coral-common/errors";
import { pureMerge } from "coral-common/utils";
import { InvalidRequestError } from "coral-framework/lib/errors";
import {
  act,
  createAccessToken,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  waitForElement,
  within,
} from "coral-framework/testHelpers";
import { GQLResolver } from "coral-framework/testHelpers/schema";

import create from "../create";
import { settings, users } from "../fixtures";

const user = users.moderators[0];

const token = createAccessToken({ email: user.email! });

const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {}
) => {
  const { testRenderer, context } = create({
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
  return { context, root: testRenderer.root };
};

it("renders missing the token", async () => {
  replaceHistoryLocation("http://localhost/admin/invite");
  const { root } = await createTestRenderer();
  await waitForElement(() => within(root).getByTestID("invalid-link"));
  expect(within(root).toJSON()).toMatchSnapshot();
});

it("renders form", async () => {
  replaceHistoryLocation(`http://localhost/admin/invite#inviteToken=${token}`);
  const { root, context } = await createTestRenderer();
  const mock = sinon.mock(context.rest);

  mock
    .expects("fetch")
    .withArgs("/account/invite", {
      method: "GET",
      token,
    })
    .once();

  await act(async () => {
    await waitForElement(() =>
      within(root).getByTestID("invite-complete-form")
    );
  });

  expect(within(root).toJSON()).toMatchSnapshot();
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
    const { root, context } = await createTestRenderer();

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
        })
      );

    await act(async () => {
      await waitForElement(() =>
        within(root).getByTestID("invite-complete-sorry")
      );
    });

    mock.verify();
  }
});

it("submits form", async () => {
  replaceHistoryLocation(`http://localhost/admin/invite#inviteToken=${token}`);
  const { context, root } = await createTestRenderer();
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

  await act(async () => {
    await waitForElement(() =>
      within(root).getByTestID("invite-complete-form")
    );
    await waitForElement(() =>
      within(root).getByText(user.email!, { exact: false })
    );
  });

  const form = within(root).getByType("form");
  const usernameField = within(root).getByLabelText("Username");
  const passwordField = within(root).getByLabelText("Password");

  // Submit an empty form.
  await act(async () => {
    await form.props.onSubmit();
  });
  within(root).getAllByText("field is required", {
    exact: false,
  });

  // Password too short.
  act(() => {
    usernameField.props.onChange(user.username!);
    passwordField.props.onChange("test");
  });
  within(root).getByText("Password must contain at least 8 characters", {
    exact: false,
  });

  // Submit valid form.
  await act(() => {
    passwordField.props.onChange("testtest");
    return form.props.onSubmit();
  });

  await waitForElement(() =>
    within(root).getByTestID("invite-complete-success")
  );

  mock.verify();
});
