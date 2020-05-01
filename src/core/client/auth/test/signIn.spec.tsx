import { get } from "lodash";
import sinon, { SinonStub } from "sinon";

import { pureMerge } from "coral-common/utils";
import {
  act,
  createAccessToken,
  toJSON,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "./create";
import { settings } from "./fixtures";

async function createTestRenderer(
  customResolver: any = {},
  error: string | null = null
) {
  const resolvers = {
    ...customResolver,
    Query: {
      ...customResolver.Query,
      settings: sinon
        .stub()
        .returns(pureMerge(settings, get(customResolver, "Query.settings"))),
    },
  };

  const { testRenderer, context } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue("SIGN_IN", "view");
      localRecord.setValue(error, "error");
    },
  });

  return await act(async () => {
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
  });
}

it("renders sign in view", async () => {
  const { testRenderer } = await createTestRenderer();
  expect(testRenderer.toJSON()).toMatchSnapshot();
  expect(await within(testRenderer.root).axe()).toHaveNoViolations();
});

it("renders sign in view with error", async () => {
  const error = "Social Login Error";
  const { testRenderer, container } = await createTestRenderer({}, error);
  within(container).getByText(error);
  act(() => {
    within(testRenderer.root).getByText("Sign up").props.onClick({});
  });
  act(() => {
    within(testRenderer.root).getByText("Sign in").props.onClick({});
  });
  const container2 = await waitForElement(() =>
    within(testRenderer.root).getByTestID("signIn-container")
  );

  // Error shouldn't be there anymore.
  await wait(() => expect(within(container2).queryByText(error)).toBeNull());
});

it("shows error when submitting empty form", async () => {
  const { form, container } = await createTestRenderer();
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

it("shows server error", async () => {
  const { form, main, context } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const emailAddressField = getByLabelText("Email address");
  const passwordField = getByLabelText("Password");
  const submitButton = form!.find(
    (i) => i.type === "button" && i.props.type === "submit"
  );

  act(() => passwordField.props.onChange({ target: { value: "testtest" } }));
  act(() =>
    emailAddressField.props.onChange({ target: { value: "hans@test.com" } })
  );

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
    form!.props.onSubmit();
  });
  expect(emailAddressField.props.disabled).toBe(true);
  expect(passwordField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await act(async () => {
    await wait(() => expect(submitButton.props.disabled).toBe(false));
  });

  within(main).getByText(error.message);

  restMock.verify();
});

it("submits form successfully", async () => {
  const { form, context } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const accessToken = createAccessToken();
  const emailAddressField = getByLabelText("Email address");
  const passwordField = getByLabelText("Password");
  const submitButton = form!.find(
    (i) => i.type === "button" && i.props.type === "submit"
  );

  act(() =>
    emailAddressField.props.onChange({ target: { value: "hans@test.com" } })
  );
  act(() => passwordField.props.onChange({ target: { value: "testtest" } }));

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

  act(() => {
    form!.props.onSubmit();
  });

  expect(emailAddressField.props.disabled).toBe(true);
  expect(passwordField.props.disabled).toBe(true);
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
