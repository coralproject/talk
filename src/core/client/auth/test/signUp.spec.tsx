import { merge } from "lodash";
import sinon from "sinon";

import { wait, waitForElement, within } from "talk-framework/testHelpers";

import create from "./create";
import { settings } from "./fixtures";
import mockWindow from "./mockWindow";

let windowMock: ReturnType<typeof mockWindow>;

async function createTestRenderer(customResolver: any = {}) {
  const resolvers = {
    ...customResolver,
    Query: {
      ...customResolver.Query,
      settings: sinon.stub().returns(merge({}, settings, customResolver)),
    },
  };

  const { testRenderer, context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue("SIGN_UP", "view");
    },
  });
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("signUp-container")
  );
  const form = within(testRenderer.root).getByType("form");

  return {
    context,
    testRenderer,
    form,
    container,
  };
}

beforeEach(async () => {
  windowMock = mockWindow();
});

afterEach(async () => {
  await wait(() => expect(windowMock.resizeStub.called).toBe(true));
  windowMock.restore();
});

it("renders sign up form", async () => {
  const { testRenderer } = await createTestRenderer();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("shows error when submitting empty form", async () => {
  const { testRenderer, form } = await createTestRenderer();
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for invalid email", async () => {
  const { testRenderer, form } = await createTestRenderer();
  const { getByLabelText } = within(form);
  const emailAddressField = getByLabelText("Email Address");
  emailAddressField.props.onChange({ target: { value: "invalid-email" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("accepts valid email", async () => {
  const { testRenderer, form } = await createTestRenderer();
  const { getByLabelText } = within(form);
  const emailAddressField = getByLabelText("Email Address");
  emailAddressField.props.onChange({ target: { value: "hans@test.com" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for too short username", async () => {
  const { testRenderer, form } = await createTestRenderer();
  const { getByLabelText } = within(form);
  const usernameField = getByLabelText("Username");
  usernameField.props.onChange({ target: { value: "u" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for too long username", async () => {
  const { testRenderer, form } = await createTestRenderer();
  const { getByLabelText } = within(form);
  const usernameField = getByLabelText("Username");
  usernameField.props.onChange({ target: { value: "a".repeat(100) } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for invalid characters in username", async () => {
  const { testRenderer, form } = await createTestRenderer();
  const { getByLabelText } = within(form);
  const usernameField = getByLabelText("Username");
  usernameField.props.onChange({ target: { value: "$%$§$%$§%" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("accepts valid username", async () => {
  const { testRenderer, form } = await createTestRenderer();
  const { getByLabelText } = within(form);
  const usernameField = getByLabelText("Username");
  usernameField.props.onChange({ target: { value: "hans" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for too short password", async () => {
  const { testRenderer, form } = await createTestRenderer();
  const { getByLabelText } = within(form);
  const passwordField = getByLabelText("Password");
  passwordField.props.onChange({ target: { value: "pass" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("accepts correct password", async () => {
  const { testRenderer, form } = await createTestRenderer();
  const { getByLabelText } = within(form);
  const passwordField = getByLabelText("Password");
  passwordField.props.onChange({ target: { value: "testtest" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("shows server error", async () => {
  const { context, testRenderer, form } = await createTestRenderer();
  const { getByLabelText } = within(form);
  const emailAddressField = getByLabelText("Email Address");
  const usernameField = getByLabelText("Username");
  const passwordField = getByLabelText("Password");
  const submitButton = form.find(
    i => i.type === "button" && i.props.type === "submit"
  );

  emailAddressField.props.onChange({ target: { value: "hans@test.com" } });
  usernameField.props.onChange({ target: { value: "hans" } });
  passwordField.props.onChange({ target: { value: "testtest" } });

  const error = new Error("Server Error");
  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/tenant/auth/local/signup", {
      method: "POST",
      body: {
        username: "hans",
        email: "hans@test.com",
        password: "testtest",
      },
    })
    .once()
    .throws(error);

  const postMessageMock = sinon.mock(context.postMessage);
  postMessageMock
    .expects("send")
    .withArgs("authError", error.toString(), window.opener)
    .once();

  form.props.onSubmit();

  expect(emailAddressField.props.disabled).toBe(true);
  expect(passwordField.props.disabled).toBe(true);
  expect(usernameField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

  expect(testRenderer.toJSON()).toMatchSnapshot();

  restMock.verify();
  postMessageMock.verify();
});

it("submits form successfully", async () => {
  const { context, testRenderer, form } = await createTestRenderer();
  const { getByLabelText } = within(form);
  const emailAddressField = getByLabelText("Email Address");
  const usernameField = getByLabelText("Username");
  const passwordField = getByLabelText("Password");
  const submitButton = form.find(
    i => i.type === "button" && i.props.type === "submit"
  );

  emailAddressField.props.onChange({ target: { value: "hans@test.com" } });
  usernameField.props.onChange({ target: { value: "hans" } });
  passwordField.props.onChange({ target: { value: "testtest" } });

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/tenant/auth/local/signup", {
      method: "POST",
      body: {
        username: "hans",
        email: "hans@test.com",
        password: "testtest",
      },
    })
    .once()
    .returns({ token: "auth-token" });

  const postMessageMock = sinon.mock(context.postMessage);
  postMessageMock
    .expects("send")
    .withArgs("setAuthToken", "auth-token", window.opener)
    .once();

  form.props.onSubmit();

  expect(emailAddressField.props.disabled).toBe(true);
  expect(passwordField.props.disabled).toBe(true);
  expect(usernameField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

  expect(testRenderer.toJSON()).toMatchSnapshot();

  // Wait for window to be closed.
  await wait(() => expect(windowMock.closeStub.called).toBe(true));
  restMock.verify();
  postMessageMock.verify();
});
