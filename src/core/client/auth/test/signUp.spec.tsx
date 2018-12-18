import { ReactTestInstance, ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { timeout } from "talk-common/utils";
import { TalkContext } from "talk-framework/lib/bootstrap";
import { wait, waitForElement, within } from "talk-framework/testHelpers";

import create from "./create";
import { settings } from "./fixtures";

let context: TalkContext;
let testRenderer: ReactTestRenderer;
let form: ReactTestInstance;
beforeEach(async () => {
  const resolvers = {
    Query: {
      settings: sinon.stub().returns(settings),
    },
  };

  const windowMock = sinon.mock(window);
  windowMock.expects("resizeTo");
  ({ testRenderer, context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue("SIGN_UP", "view");
    },
  }));
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("signUp-container")
  );
  form = within(testRenderer.root).getByType("form");
  windowMock.restore();
});

it("renders sign up form", async () => {
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("shows error when submitting empty form", async () => {
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for invalid email", async () => {
  const { getByLabelText } = within(form);
  const emailAddressField = getByLabelText("Email Address");
  emailAddressField.props.onChange({ target: { value: "invalid-email" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("accepts valid email", async () => {
  const { getByLabelText } = within(form);
  const emailAddressField = getByLabelText("Email Address");
  emailAddressField.props.onChange({ target: { value: "hans@test.com" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for too short username", async () => {
  const { getByLabelText } = within(form);
  const usernameField = getByLabelText("Username");
  usernameField.props.onChange({ target: { value: "u" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for too long username", async () => {
  const { getByLabelText } = within(form);
  const usernameField = getByLabelText("Username");
  usernameField.props.onChange({ target: { value: "a".repeat(100) } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for invalid characters in username", async () => {
  const { getByLabelText } = within(form);
  const usernameField = getByLabelText("Username");
  usernameField.props.onChange({ target: { value: "$%$§$%$§%" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("accepts valid username", async () => {
  const { getByLabelText } = within(form);
  const usernameField = getByLabelText("Username");
  usernameField.props.onChange({ target: { value: "hans" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("checks for too short password", async () => {
  const { getByLabelText } = within(form);
  const passwordField = getByLabelText("Password");
  passwordField.props.onChange({ target: { value: "pass" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("accepts correct password", async () => {
  const { getByLabelText } = within(form);
  const passwordField = getByLabelText("Password");
  passwordField.props.onChange({ target: { value: "testtest" } });
  form.props.onSubmit();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("shows server error", async () => {
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

  const windowMock = sinon.mock(window);
  windowMock.expects("resizeTo");

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
  // Wait for resize to trigger.
  await timeout();

  restMock.verify();
  postMessageMock.verify();
  windowMock.verify();
});

it("submits form successfully", async () => {
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

  const windowMock = sinon.mock(window);
  windowMock.expects("close").once();
  windowMock.expects("resizeTo");

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
  // Wait for resize to trigger.
  await timeout();

  restMock.verify();
  postMessageMock.verify();
  windowMock.verify();
});
