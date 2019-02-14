import { ReactTestInstance } from "react-test-renderer";
import sinon from "sinon";

import {
  createAccessToken,
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  settings,
} from "../fixtures";

const resolvers = {
  Query: {
    settings: sinon.stub().returns(settings),
    moderationQueues: sinon.stub().returns(emptyModerationQueues),
    comments: sinon.stub().returns(emptyRejectedComments),
  },
};

const inputPredicate = (name: string) => (n: ReactTestInstance) => {
  return n.props.name === name && n.props.onChange;
};

async function createTestRenderer() {
  // deliberately setting to a different route,
  // it should be smart enough to reroute to /admin/login.
  replaceHistoryLocation("http://localhost/admin/moderate");

  const { testRenderer, context } = create({
    resolvers,
    // Set this to true, to see graphql responses.
    logNetwork: false,
    initLocalState: localRecord => {
      localRecord.setValue(false, "loggedIn");
      localRecord.setValue("SIGN_IN", "authView");
    },
  });
  const form = await waitForElement(() =>
    within(testRenderer.root).getByType("form")
  );
  return { testRenderer, form, context };
}

it("renders sign in form", async () => {
  const { testRenderer } = await createTestRenderer();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("shows error when submitting empty form", async () => {
  const { form } = await createTestRenderer();
  form.props.onSubmit();
  expect(within(form).toJSON()).toMatchSnapshot();
});

it("checks for invalid email", async () => {
  const { form } = await createTestRenderer();
  within(form)
    .getByLabelText("Email Address")
    .props.onChange({ target: { value: "invalid-email" } });
  form.props.onSubmit();
  expect(within(form).toJSON()).toMatchSnapshot();
});

it("accepts valid email", async () => {
  const { form } = await createTestRenderer();
  within(form)
    .getByLabelText("Email Address")
    .props.onChange({ target: { value: "hans@test.com" } });
  form.props.onSubmit();
  expect(within(form).toJSON()).toMatchSnapshot();
});

it("accepts correct password", async () => {
  const { form } = await createTestRenderer();
  within(form)
    .getByLabelText("Password")
    .props.onChange({ target: { value: "testtest" } });
  form.props.onSubmit();
  expect(within(form).toJSON()).toMatchSnapshot();
});

it("shows server error", async () => {
  const { form, context } = await createTestRenderer();
  within(form)
    .getByLabelText("Email Address")
    .props.onChange({ target: { value: "hans@test.com" } });
  within(form)
    .getByLabelText("Password")
    .props.onChange({ target: { value: "testtest" } });

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

  form.props.onSubmit();
  const submitButton = within(form).getByText("Sign in with Email", {
    selector: "button",
  });
  expect(submitButton.props.disabled).toBe(true);
  await wait(() => expect(submitButton.props.disabled).toBe(false));
  expect(within(form).toJSON()).toMatchSnapshot();
  restMock.verify();
});

it("submits form successfully", async () => {
  const { form, context } = await createTestRenderer();
  form
    .find(inputPredicate("email"))
    .props.onChange({ target: { value: "hans@test.com" } });
  form
    .find(inputPredicate("password"))
    .props.onChange({ target: { value: "testtest" } });

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

  form.props.onSubmit();
  const submitButton = within(form).getByText("Sign in with Email", {
    selector: "button",
  });
  expect(submitButton.props.disabled).toBe(true);
  await wait(() => expect(submitButton.props.disabled).toBe(false));
  expect(location.toString()).toMatchSnapshot();
  restMock.verify();
  historyMock.verify();
});
