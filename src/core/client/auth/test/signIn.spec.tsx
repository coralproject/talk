import { ReactTestInstance, ReactTestRenderer } from "react-test-renderer";
import sinon from "sinon";

import { TalkContext } from "talk-framework/lib/bootstrap";
import { wait, waitForElement, within } from "talk-framework/testHelpers";

import create from "./create";
import { settings } from "./fixtures";
import mockWindow from "./mockWindow";

let context: TalkContext;
let testRenderer: ReactTestRenderer;
let form: ReactTestInstance;
let windowMock: ReturnType<typeof mockWindow>;

beforeEach(async () => {
  const resolvers = {
    Query: {
      settings: sinon.stub().returns(settings),
    },
  };

  windowMock = mockWindow();
  ({ testRenderer, context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue("SIGN_IN", "view");
    },
  }));
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("signIn-container")
  );
  form = within(testRenderer.root).getByType("form");
});

afterEach(async () => {
  await wait(() => expect(windowMock.resizeStub.called).toBe(true));
  windowMock.restore();
});

it("renders sign in form", async () => {
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
  const passwordField = getByLabelText("Password");
  const submitButton = form.find(
    i => i.type === "button" && i.props.type === "submit"
  );

  passwordField.props.onChange({ target: { value: "testtest" } });
  emailAddressField.props.onChange({ target: { value: "hans@test.com" } });

  const error = new Error("Server Error");
  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/tenant/auth/local", {
      method: "POST",
      body: {
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
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

  expect(testRenderer.toJSON()).toMatchSnapshot();

  restMock.verify();
  postMessageMock.verify();
});

it("submits form successfully", async () => {
  const { getByLabelText } = within(form);
  const emailAddressField = getByLabelText("Email Address");
  const passwordField = getByLabelText("Password");
  const submitButton = form.find(
    i => i.type === "button" && i.props.type === "submit"
  );

  emailAddressField.props.onChange({ target: { value: "hans@test.com" } });
  passwordField.props.onChange({ target: { value: "testtest" } });

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/tenant/auth/local", {
      method: "POST",
      body: {
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
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

  expect(testRenderer.toJSON()).toMatchSnapshot();

  // Wait for window to be closed.
  await wait(() => expect(windowMock.closeStub.called).toBe(true));
  restMock.verify();
  postMessageMock.verify();
});
