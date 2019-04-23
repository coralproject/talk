import { get } from "lodash";
import sinon from "sinon";

import { pureMerge } from "talk-common/utils";
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
    initLocalState: localRecord => {
      localRecord.setValue("SIGN_IN", "view");
      localRecord.setValue(error, "error");
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

it("renders sign in view with error", async () => {
  const { testRenderer, container } = await createTestRenderer(
    {},
    "Social Login Error"
  );
  expect(within(container).toJSON()).toMatchSnapshot();
  within(testRenderer.root)
    .getByTestID("gotoSignUpButton")
    .props.onClick();
  within(testRenderer.root)
    .getByTestID("gotoSignInButton")
    .props.onClick();
  const container2 = await waitForElement(() =>
    within(testRenderer.root).getByTestID("signIn-container")
  );

  // Error shouldn't be there anymore.
  await wait(() =>
    expect(
      within(container2).queryByText("Social Login Error", { exact: false })
    ).toBeNull()
  );
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
    .withArgs("/auth/local", {
      method: "POST",
      body: {
        email: "hans@test.com",
        password: "testtest",
      },
    })
    .once()
    .throws(error);

  form!.props.onSubmit();
  expect(emailAddressField.props.disabled).toBe(true);
  expect(passwordField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

  expect(toJSON(form!)).toMatchSnapshot();

  restMock.verify();
});

it("submits form successfully", async () => {
  const { form, context } = await createTestRenderer();
  const { getByLabelText } = within(form!);
  const accessToken = "access-token";
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
    .withArgs("/auth/local", {
      method: "POST",
      body: {
        email: "hans@test.com",
        password: "testtest",
      },
    })
    .once()
    .returns({ token: accessToken });

  form!.props.onSubmit();

  expect(emailAddressField.props.disabled).toBe(true);
  expect(passwordField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

  expect(toJSON(form!)).toMatchSnapshot();

  // Wait for window hash to contain a token.
  await wait(() => expect(location.hash).toBe(`#accessToken=${accessToken}`));
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
