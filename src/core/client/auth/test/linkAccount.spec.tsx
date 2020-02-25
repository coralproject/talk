import sinon from "sinon";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createAccessToken,
  createResolversStub,
  CreateTestRendererParams,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "./create";
import { settings } from "./fixtures";

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          viewer: () => ({ id: "me", profiles: [] }),
          settings: () => settings,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("LINK_ACCOUNT", "view");
      localRecord.setValue("my@email.com", "duplicateEmail");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("linkAccount-container")
  );
  const form = within(container).queryByType("form")!;
  const passwordField = within(form).getByLabelText("Password");

  return {
    context,
    testRenderer,
    form,
    container,
    passwordField,
  };
}

it("renders link account view", async () => {
  const { testRenderer } = await createTestRenderer();
  expect(testRenderer.toJSON()).toMatchSnapshot();
  expect(await within(testRenderer.root).axe()).toHaveNoViolations();
});

it("checks for required password", async () => {
  const { form, container } = await createTestRenderer();
  act(() => {
    form.props.onSubmit();
  });
  within(container).getByText("This field is required", { exact: false });
});

it("performs account linking", async () => {
  const { form, passwordField, context } = await createTestRenderer();
  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/auth/link", {
      method: "POST",
      body: {
        email: "my@email.com",
        password: "testtest",
      },
    })
    .once()
    .returns({
      token: createAccessToken(),
    });

  act(() => {
    passwordField.props.onChange("testtest");
  });
  act(() => {
    form.props.onSubmit();
  });

  // Look for visual cues for form submission progress.
  expect(passwordField.props.disabled).toBe(true);
  await act(async () => {
    await wait(() => expect(passwordField.props.disabled).toBe(false));
  });

  restMock.verify();
});

it("shows server error", async () => {
  const { form, passwordField, context } = await createTestRenderer();
  const error = new Error("Server Error");
  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/auth/link", {
      method: "POST",
      body: {
        email: "my@email.com",
        password: "testtest",
      },
    })
    .once()
    .throws(error);

  act(() => {
    passwordField.props.onChange("testtest");
  });
  act(() => {
    form.props.onSubmit();
  });

  // Look for visual cues for form submission progress.
  expect(passwordField.props.disabled).toBe(true);
  await act(async () => {
    await wait(() => expect(passwordField.props.disabled).toBe(false));
  });
  within(form).getByText("Server Error", { exact: false });

  restMock.verify();
});

it("change email view", async () => {
  const { testRenderer, container } = await createTestRenderer();
  const button = within(container).getByText("Use a different Email", {
    exact: false,
  });
  act(() => {
    button.props.onClick();
  });

  await act(async () => {
    await waitForElement(() =>
      within(testRenderer.root).getByTestID("addEmailAddress-container")
    );
  });
});
