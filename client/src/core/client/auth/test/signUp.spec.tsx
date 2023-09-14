import { get, merge } from "lodash";
import sinon, { SinonStub } from "sinon";

import {
  act,
  createAccessToken,
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
    initLocalState: (localRecord) => {
      localRecord.setValue("SIGN_UP", "view");
    },
  });

  return await act(async () => {
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
  });
}

it("renders sign up form", async () => {
  const { testRenderer } = await createTestRenderer();
  expect(await within(testRenderer.root).axe()).toHaveNoViolations();
});

it("shows error when submitting empty form", async () => {
  const { container, form } = await createTestRenderer();
  act(() => {
    form!.props.onSubmit();
  });
  within(container).getAllByText("This field is required", { exact: false });
});

it("checks for invalid email", async () => {
  const { container, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const emailAddressField = getByLabelText("Email address");
  act(() => {
    emailAddressField.props.onChange({ target: { value: "invalid-email" } });
  });
  act(() => {
    form!.props.onSubmit();
  });
  within(container).getByText("Please enter a valid email address", {
    exact: false,
  });
});

it("accepts valid email", async () => {
  const { container, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const emailAddressField = getByLabelText("Email address");
  act(() => {
    emailAddressField.props.onChange({ target: { value: "hans@test.com" } });
  });
  act(() => {
    form!.props.onSubmit();
  });
  expect(() =>
    within(container).getAllByText("Please enter a valid email address", {
      exact: false,
    })
  ).toThrow();
});

it("checks for too short username", async () => {
  const { container, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const usernameField = getByLabelText("Username");
  act(() => {
    usernameField.props.onChange({ target: { value: "u" } });
  });
  act(() => {
    form!.props.onSubmit();
  });
  within(container).getByText("Username must contain at least 3 characters", {
    exact: false,
  });
});

it("checks for too long username", async () => {
  const { container, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const usernameField = getByLabelText("Username");
  act(() => {
    usernameField.props.onChange({ target: { value: "a".repeat(100) } });
  });
  act(() => {
    form!.props.onSubmit();
  });
  within(container).getByText("Must be at least 8 characters", {
    exact: false,
  });
});

it("checks for invalid characters in username", async () => {
  const { container, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const usernameField = getByLabelText("Username");
  act(() => {
    usernameField.props.onChange({ target: { value: "$%$§$%$§%" } });
  });
  act(() => {
    form!.props.onSubmit();
  });
  within(container).getByText("Invalid characters.", {
    exact: false,
  });
});

it("accepts valid username", async () => {
  const { container, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const usernameField = getByLabelText("Username");
  act(() => {
    usernameField.props.onChange({ target: { value: "hans" } });
  });
  act(() => {
    form!.props.onSubmit();
  });
  expect(() =>
    within(container).getByText("Invalid characters.", {
      exact: false,
    })
  ).toThrow();
});

it("checks for too short password", async () => {
  const { container, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const passwordField = getByLabelText("Password");
  act(() => {
    passwordField.props.onChange({ target: { value: "pass" } });
  });
  act(() => {
    form!.props.onSubmit();
  });
  within(container).getByText("Password must contain at least 8 characters.", {
    exact: false,
  });
});

it("accepts correct password", async () => {
  const { container, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const passwordField = getByLabelText("Password");
  act(() => {
    passwordField.props.onChange({ target: { value: "testtest" } });
  });
  act(() => {
    form!.props.onSubmit();
  });
  expect(() =>
    within(container).getByText(
      "Password must contain at least 8 characters.",
      {
        exact: false,
      }
    )
  ).toThrow();
});

it("shows server error", async () => {
  const { context, main, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const emailAddressField = getByLabelText("Email address");
  const usernameField = getByLabelText("Username");
  const passwordField = getByLabelText("Password");
  const submitButton = form!.find(
    (i) => i.type === "button" && i.props.type === "submit"
  );

  act(() =>
    emailAddressField.props.onChange({ target: { value: "hans@test.com" } })
  );
  act(() => usernameField.props.onChange({ target: { value: "hans" } }));
  act(() => passwordField.props.onChange({ target: { value: "testtest" } }));

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

  act(() => {
    form!.props.onSubmit();
  });

  expect(emailAddressField.props.disabled).toBe(true);
  expect(passwordField.props.disabled).toBe(true);
  expect(usernameField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await act(async () => {
    await wait(() => expect(submitButton.props.disabled).toBe(false));
  });

  within(main).getByText("Server Error");

  restMock.verify();
});

it("submits form successfully", async () => {
  const { context, form } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const accessToken = createAccessToken();
  const emailAddressField = getByLabelText("Email address");
  const usernameField = getByLabelText("Username");
  const passwordField = getByLabelText("Password");
  const submitButton = form!.find(
    (i) => i.type === "button" && i.props.type === "submit"
  );

  act(() =>
    emailAddressField.props.onChange({ target: { value: "hans@test.com" } })
  );
  act(() => usernameField.props.onChange({ target: { value: "hans" } }));
  act(() => passwordField.props.onChange({ target: { value: "testtest" } }));

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

  act(() => {
    form!.props.onSubmit();
  });

  expect(emailAddressField.props.disabled).toBe(true);
  expect(passwordField.props.disabled).toBe(true);
  expect(usernameField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await act(async () => {
    await wait(() => expect(submitButton.props.disabled).toBe(false));
  });

  // Wait for new session to start.
  await wait(() =>
    expect((context.clearSession as SinonStub).calledWith(accessToken)).toBe(
      true
    )
  );
  restMock.verify();
});

describe("auth configuration", () => {
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
});
