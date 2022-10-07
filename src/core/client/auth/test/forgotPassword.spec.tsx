import sinon from "sinon";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "./create";
import { settings } from "./fixtures";
import mockWindow from "./mockWindow";

let windowMock: ReturnType<typeof mockWindow>;

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
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
      localRecord.setValue("FORGOT_PASSWORD", "view");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("forgotPassword-container")
  );
  const main = within(testRenderer.root).getByTestID(/.*-main/);
  const form = within(main).queryByType("form")!;
  const emailField = within(form).getByLabelText("Email address");

  return {
    context,
    testRenderer,
    form,
    main,
    container,
    emailField,
  };
}

beforeEach(async () => {
  windowMock = mockWindow();
});

afterEach(async () => {
  windowMock.restore();
});

it("renders forgot password view", async () => {
  const { testRenderer } = await createTestRenderer();
  expect(testRenderer.toJSON()).toMatchSnapshot();
  expect(await within(testRenderer.root).axe()).toHaveNoViolations();
});

it("shows error when submitting empty form", async () => {
  const { form } = await createTestRenderer();
  await act(async () => {
    await form.props.onSubmit();
  });

  within(form).getByText("This field is required", { exact: false });
});

it("checks for invalid email", async () => {
  const { form, emailField } = await createTestRenderer();
  act(() => emailField.props.onChange("invalidemail"));
  await act(async () => await form.props.onSubmit());

  within(form).getByText("Please enter a valid email address", {
    exact: false,
  });
});

it("shows server error", async () => {
  const { form, context, emailField } = await createTestRenderer();
  const error = new Error("Server Error");
  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/auth/local/forgot", {
      method: "POST",
      body: {
        email: "hans@test.com",
      },
    })
    .once()
    .throws(error);

  act(() => emailField.props.onChange("hans@test.com"));
  await act(async () => await form.props.onSubmit());

  await waitForElement(() =>
    within(form).getByText("Server Error", {
      exact: false,
    })
  );

  restMock.verify();
});

it("submits form successfully", async () => {
  const { form, context, emailField, testRenderer } =
    await createTestRenderer();
  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/auth/local/forgot", {
      method: "POST",
      body: {
        email: "hans@test.com",
      },
    })
    .once();

  act(() => emailField.props.onChange("hans@test.com"));
  await act(async () => form.props.onSubmit());

  await waitForElement(() =>
    within(testRenderer.root).getByText("Check Your Email", { exact: false })
  );

  act(() => {
    within(testRenderer.root).getByText("Close").props.onClick();
  });

  restMock.verify();

  expect(windowMock.closeStub.called).toBe(true);
});
