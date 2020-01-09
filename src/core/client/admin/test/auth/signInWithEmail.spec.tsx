import { ReactTestInstance } from "react-test-renderer";
import sinon from "sinon";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createAccessToken,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
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

  const { testRenderer, context } = create({
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

  let form: ReactTestInstance;
  await act(async () => {
    form = await waitForElement(() =>
      within(testRenderer.root).getByType("form")
    );
  });
  return { testRenderer, form: form!, context };
}

it("renders sign in form", async () => {
  const { testRenderer } = await createTestRenderer();

  await act(async () => {
    await wait(() => {
      expect(testRenderer.toJSON()).toMatchSnapshot();
    });
  });
});

it("shows error when submitting empty form", async () => {
  const { form } = await createTestRenderer();
  act(() => {
    form.props.onSubmit();
  });

  await act(async () => {
    await wait(() => {
      expect(within(form).toJSON()).toMatchSnapshot();
    });
  });
});

it("checks for invalid email", async () => {
  const { form } = await createTestRenderer();

  act(() => {
    within(form)
      .getByTestID("email-field")
      .props.onChange({ target: { value: "invalid-email" } });
  });
  act(() => {
    form.props.onSubmit();
  });

  await act(async () => {
    await wait(() => {
      expect(within(form).toJSON()).toMatchSnapshot();
    });
  });
});

it("accepts valid email", async () => {
  const { form } = await createTestRenderer();

  act(() => {
    within(form)
      .getByTestID("email-field")
      .props.onChange({ target: { value: "hans@test.com" } });
  });
  act(() => {
    form.props.onSubmit();
  });

  await act(async () => {
    await wait(() => {
      expect(within(form).toJSON()).toMatchSnapshot();
    });
  });
});

it("accepts correct password", async () => {
  const { form } = await createTestRenderer();

  act(() => {
    within(form)
      .getByTestID("password-field")
      .props.onChange({ target: { value: "testtest" } });
  });
  act(() => {
    form.props.onSubmit();
  });

  await act(async () => {
    await wait(() => {
      expect(within(form).toJSON()).toMatchSnapshot();
    });
  });
});

it("shows server error", async () => {
  const { form, context } = await createTestRenderer();
  act(() => {
    within(form)
      .getByTestID("email-field")
      .props.onChange({ target: { value: "hans@test.com" } });
  });
  act(() => {
    within(form)
      .getByTestID("password-field")
      .props.onChange({ target: { value: "testtest" } });
  });

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

  act(() => {
    form.props.onSubmit();
  });

  const submitButton = within(form).getByText("Sign in with Email", {
    selector: "button",
  });
  expect(submitButton.props.disabled).toBe(true);

  await act(async () => {
    await wait(() => expect(submitButton.props.disabled).toBe(false));
  });
  expect(within(form).toJSON()).toMatchSnapshot();
  restMock.verify();
});

it("submits form successfully", async () => {
  const { form, context } = await createTestRenderer();
  act(() => {
    within(form)
      .getByTestID("email-field")
      .props.onChange({ target: { value: "hans@test.com" } });
  });
  act(() => {
    within(form)
      .getByTestID("password-field")
      .props.onChange({ target: { value: "testtest" } });
  });

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

  act(() => {
    form.props.onSubmit();
  });
  const submitButton = within(form).getByText("Sign in with Email", {
    selector: "button",
  });
  expect(submitButton.props.disabled).toBe(true);

  await act(async () => {
    await wait(() => expect(submitButton.props.disabled).toBe(false));
  });
  expect(location.toString()).toMatchSnapshot();
  restMock.verify();
  historyMock.verify();
});
