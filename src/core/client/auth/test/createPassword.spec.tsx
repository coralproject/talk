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
  options: { muteNetworkErrors?: boolean; logNetwork?: boolean } = {}
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
    logNetwork: options.logNetwork,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue("CREATE_PASSWORD", "view");
    },
  });
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("createPassword-container")
  );
  const main = within(testRenderer.root).getByTestID(/.*-main/);
  const form = within(main).getByType("form");
  const passwordField = within(form).getByLabelText("Password");

  return {
    context,
    testRenderer,
    form,
    main,
    root: testRenderer.root,
    passwordField,
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

it("renders createPassword view", async () => {
  const { root } = await createTestRenderer();
  expect(toJSON(root)).toMatchSnapshot();
});

it("shows error when submitting empty form", async () => {
  const { form } = await createTestRenderer();
  form.props.onSubmit();
  expect(toJSON(form)).toMatchSnapshot();
});

it("checks for invalid password", async () => {
  const { form, passwordField } = await createTestRenderer();
  passwordField.props.onChange({ target: { value: "x" } });
  form.props.onSubmit();
  expect(toJSON(form)).toMatchSnapshot();
});

it("shows server error", async () => {
  const password = "secretpassword";
  const setPassword = sinon.stub().callsFake((_: any, data: any) => {
    throw new Error("server error");
  });
  const { form, passwordField } = await createTestRenderer(
    {
      Mutation: {
        setPassword,
      },
    },
    { muteNetworkErrors: true }
  );
  const submitButton = form.find(
    i => i.type === "button" && i.props.type === "submit"
  );

  passwordField.props.onChange({ target: { value: password } });

  form.props.onSubmit();
  expect(passwordField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

  expect(toJSON(form)).toMatchSnapshot();
});

it("successfully sets password", async () => {
  const password = "secretpassword";
  const setPassword = sinon.stub().callsFake((_: any, data: any) => {
    expectAndFail(data.input).toEqual({
      password,
      clientMutationId: data.input.clientMutationId,
    });
    return {
      user: {
        id: "me",
        profiles: [],
      },
      clientMutationId: data.input.clientMutationId,
    };
  });
  const { form, passwordField } = await createTestRenderer({
    Mutation: {
      setPassword,
    },
  });
  const submitButton = form.find(
    i => i.type === "button" && i.props.type === "submit"
  );

  passwordField.props.onChange({ target: { value: password } });

  form.props.onSubmit();
  expect(passwordField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

  expect(toJSON(form)).toMatchSnapshot();
  expect(setPassword.called).toBe(true);
});
