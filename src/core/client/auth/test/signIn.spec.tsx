import { get, merge } from "lodash";
import sinon from "sinon";

import {
  toJSON,
  wait,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import create from "./create";
import { settings } from "./fixtures";
import mockWindow from "./mockWindow";

let windowMock: ReturnType<typeof mockWindow>;

async function createTestRenderer(customResolver: any = {}) {
  const resolvers = {
    ...customResolver,
    Query: {
      ...customResolver.Query,
      settings: sinon
        .stub()
        .returns(merge({}, settings, get(customResolver, "Query.settings"))),
    },
  };

  const { testRenderer, context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue("SIGN_IN", "view");
    },
  });
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("signIn-container")
  );
  const main = within(testRenderer.root).getByTestID(/.*-main/);
  const form = within(main).queryByType("form");

  return {
    context,
    testRenderer,
    form,
    main,
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

it("renders sign in view", async () => {
  const { testRenderer } = await createTestRenderer();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("shows error when submitting empty form", async () => {
  const { form } = await createTestRenderer();
  form!.props.onSubmit();
  expect(toJSON(form!)).toMatchSnapshot();
});

it("checks for invalid email", async () => {
  const { form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const emailAddressField = getByLabelText("Email Address");
  emailAddressField.props.onChange({ target: { value: "invalid-email" } });
  form!.props.onSubmit();
  expect(toJSON(form!)).toMatchSnapshot();
});

it("accepts valid email", async () => {
  const { form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const emailAddressField = getByLabelText("Email Address");
  emailAddressField.props.onChange({ target: { value: "hans@test.com" } });
  form!.props.onSubmit();
  expect(toJSON(form!)).toMatchSnapshot();
});

it("accepts correct password", async () => {
  const { form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const passwordField = getByLabelText("Password");
  passwordField.props.onChange({ target: { value: "testtest" } });
  form!.props.onSubmit();
  expect(toJSON(form!)).toMatchSnapshot();
});

it("shows server error", async () => {
  const { form, context } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const emailAddressField = getByLabelText("Email Address");
  const passwordField = getByLabelText("Password");
  const submitButton = form!.find(
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

  form!.props.onSubmit();
  expect(emailAddressField.props.disabled).toBe(true);
  expect(passwordField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

  expect(toJSON(form!)).toMatchSnapshot();

  restMock.verify();
  postMessageMock.verify();
});

it("submits form! successfully", async () => {
  const { form, context } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const emailAddressField = getByLabelText("Email Address");
  const passwordField = getByLabelText("Password");
  const submitButton = form!.find(
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

  form!.props.onSubmit();

  expect(emailAddressField.props.disabled).toBe(true);
  expect(passwordField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

  expect(toJSON(form!)).toMatchSnapshot();

  // Wait for window to be closed.
  await wait(() => expect(windowMock.closeStub.called).toBe(true));
  restMock.verify();
  postMessageMock.verify();
});

describe("auth configuration", () => {
  it("renders all auth enabled", async () => {
    const { main } = await createTestRenderer({
      Query: {
        settings: {
          auth: {
            integrations: {
              facebook: {
                enabled: true,
              },
              google: {
                enabled: true,
              },
              oidc: {
                enabled: true,
              },
            },
          },
        },
      },
    });
    expect(toJSON(main)).toMatchSnapshot();
  });
  it("renders all social login disabled", async () => {
    const { main } = await createTestRenderer({
      Query: {
        settings: {
          auth: {
            integrations: {
              facebook: {
                enabled: false,
              },
              google: {
                enabled: false,
              },
              oidc: {
                enabled: false,
              },
            },
          },
        },
      },
    });
    const { queryByText } = within(main);
    expect(queryByText("facebook")).toBeNull();
    expect(queryByText("google")).toBeNull();
    expect(queryByText("oidc")).toBeNull();
  });
  it("renders all social login disabled for stream target", async () => {
    const { main } = await createTestRenderer({
      Query: {
        settings: {
          auth: {
            integrations: {
              facebook: {
                enabled: true,
                targetFilter: {
                  stream: false,
                },
              },
              google: {
                enabled: true,
                targetFilter: {
                  stream: false,
                },
              },
              oidc: {
                enabled: true,
                targetFilter: {
                  stream: false,
                },
              },
            },
          },
        },
      },
    });
    const { queryByText } = within(main);
    expect(queryByText("facebook")).toBeNull();
    expect(queryByText("google")).toBeNull();
    expect(queryByText("oidc")).toBeNull();
  });
  it("renders only some social login enabled", async () => {
    const { main } = await createTestRenderer({
      Query: {
        settings: {
          auth: {
            integrations: {
              local: {
                enabled: false,
              },
              google: {
                enabled: true,
              },
              facebook: {
                enabled: true,
              },
            },
          },
        },
      },
    });
    expect(toJSON(main)).toMatchSnapshot();
  });
});
