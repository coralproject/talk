import { get, merge } from "lodash";
import sinon, { SinonStub } from "sinon";

import {
  createAccessToken,
  toJSON,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "./create";
import { settings } from "./fixtures";

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
      localRecord.setValue("SIGN_UP", "view");
    },
  });
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("signUp-container")
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

it("renders sign up form", async () => {
  const { testRenderer } = await createTestRenderer();
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("shows error when submitting empty form", async () => {
  const { main, form } = await createTestRenderer();
  form!.props.onSubmit();
  expect(toJSON(main)).toMatchSnapshot();
});

it("checks for invalid email", async () => {
  const { main, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const emailAddressField = getByLabelText("Email Address");
  emailAddressField.props.onChange({ target: { value: "invalid-email" } });
  form!.props.onSubmit();
  expect(toJSON(main)).toMatchSnapshot();
});

it("accepts valid email", async () => {
  const { main, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const emailAddressField = getByLabelText("Email Address");
  emailAddressField.props.onChange({ target: { value: "hans@test.com" } });
  form!.props.onSubmit();
  expect(toJSON(main)).toMatchSnapshot();
});

it("checks for too short username", async () => {
  const { main, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const usernameField = getByLabelText("Username");
  usernameField.props.onChange({ target: { value: "u" } });
  form!.props.onSubmit();
  expect(toJSON(main)).toMatchSnapshot();
});

it("checks for too long username", async () => {
  const { main, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const usernameField = getByLabelText("Username");
  usernameField.props.onChange({ target: { value: "a".repeat(100) } });
  form!.props.onSubmit();
  expect(toJSON(main)).toMatchSnapshot();
});

it("checks for invalid characters in username", async () => {
  const { main, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const usernameField = getByLabelText("Username");
  usernameField.props.onChange({ target: { value: "$%$§$%$§%" } });
  form!.props.onSubmit();
  expect(toJSON(main)).toMatchSnapshot();
});

it("accepts valid username", async () => {
  const { main, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const usernameField = getByLabelText("Username");
  usernameField.props.onChange({ target: { value: "hans" } });
  form!.props.onSubmit();
  expect(toJSON(main)).toMatchSnapshot();
});

it("checks for too short password", async () => {
  const { main, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const passwordField = getByLabelText("Password");
  passwordField.props.onChange({ target: { value: "pass" } });
  form!.props.onSubmit();
  expect(toJSON(main)).toMatchSnapshot();
});

it("accepts correct password", async () => {
  const { main, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const passwordField = getByLabelText("Password");
  passwordField.props.onChange({ target: { value: "testtest" } });
  form!.props.onSubmit();
  expect(toJSON(main)).toMatchSnapshot();
});

it("shows server error", async () => {
  const { context, main, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const emailAddressField = getByLabelText("Email Address");
  const usernameField = getByLabelText("Username");
  const passwordField = getByLabelText("Password");
  const submitButton = form!.find(
    i => i.type === "button" && i.props.type === "submit"
  );

  emailAddressField.props.onChange({ target: { value: "hans@test.com" } });
  usernameField.props.onChange({ target: { value: "hans" } });
  passwordField.props.onChange({ target: { value: "testtest" } });

  const error = new Error("Server Error");
  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/auth/local/signup", {
      method: "POST",
      body: {
        username: "hans",
        email: "hans@test.com",
        password: "testtest",
      },
    })
    .once()
    .throws(error);

  form!.props.onSubmit();

  expect(emailAddressField.props.disabled).toBe(true);
  expect(passwordField.props.disabled).toBe(true);
  expect(usernameField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

  expect(toJSON(main)).toMatchSnapshot();

  restMock.verify();
});

it("submits form successfully", async () => {
  const { context, main, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const accessToken = createAccessToken();
  const emailAddressField = getByLabelText("Email Address");
  const usernameField = getByLabelText("Username");
  const passwordField = getByLabelText("Password");
  const submitButton = form!.find(
    i => i.type === "button" && i.props.type === "submit"
  );

  emailAddressField.props.onChange({ target: { value: "hans@test.com" } });
  usernameField.props.onChange({ target: { value: "hans" } });
  passwordField.props.onChange({ target: { value: "testtest" } });

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/auth/local/signup", {
      method: "POST",
      body: {
        username: "hans",
        email: "hans@test.com",
        password: "testtest",
      },
    })
    .once()
    .returns({ token: accessToken });

  form!.props.onSubmit();

  expect(emailAddressField.props.disabled).toBe(true);
  expect(passwordField.props.disabled).toBe(true);
  expect(usernameField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

  expect(toJSON(main)).toMatchSnapshot();

  // Wait for new session to start.
  await wait(() =>
    expect((context.clearSession as SinonStub).calledWith(accessToken)).toBe(
      true
    )
  );
  restMock.verify();
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
  it("renders all social login disabled by turning off registration", async () => {
    const { main } = await createTestRenderer({
      Query: {
        settings: {
          auth: {
            integrations: {
              facebook: {
                enabled: true,
                allowRegistration: false,
              },
              google: {
                enabled: true,
                allowRegistration: false,
              },
              oidc: {
                enabled: true,
                allowRegistration: false,
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
