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
      localRecord.setValue("CREATE_USERNAME", "view");
    },
  });
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("createUsername-container")
  );
  const main = within(testRenderer.root).getByTestID(/.*-main/);
  const form = within(main).getByType("form");
  const usernameField = within(form).getByLabelText("Username");

  return {
    context,
    testRenderer,
    form,
    main,
    root: testRenderer.root,
    usernameField,
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

it("renders createUsername view", async () => {
  const { root } = await createTestRenderer();
  expect(toJSON(root)).toMatchSnapshot();
});

it("shows error when submitting empty form", async () => {
  const { form } = await createTestRenderer();
  form.props.onSubmit();
  expect(toJSON(form)).toMatchSnapshot();
});

it("checks for invalid username", async () => {
  const { form, usernameField } = await createTestRenderer();
  usernameField.props.onChange({ target: { value: "x" } });
  form.props.onSubmit();
  expect(toJSON(form)).toMatchSnapshot();
});

it("shows server error", async () => {
  const username = "hans";
  const setUsername = sinon.stub().callsFake((_: any, data: any) => {
    throw new Error("server error");
  });
  const { form, usernameField } = await createTestRenderer(
    {
      Mutation: {
        setUsername,
      },
    },
    { muteNetworkErrors: true }
  );
  const submitButton = form.find(
    i => i.type === "button" && i.props.type === "submit"
  );

  usernameField.props.onChange({ target: { value: username } });

  form.props.onSubmit();
  expect(usernameField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

  expect(toJSON(form)).toMatchSnapshot();
});

it("successfully sets username", async () => {
  const username = "hans";
  const setUsername = sinon.stub().callsFake((_: any, data: any) => {
    expectAndFail(data.input).toEqual({
      username,
      clientMutationId: data.input.clientMutationId,
    });
    return {
      user: {
        id: "me",
        username,
      },
      clientMutationId: data.input.clientMutationId,
    };
  });
  const { form, usernameField } = await createTestRenderer({
    Mutation: {
      setUsername,
    },
  });
  const submitButton = form.find(
    i => i.type === "button" && i.props.type === "submit"
  );

  usernameField.props.onChange({ target: { value: username } });

  form.props.onSubmit();
  expect(usernameField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

  expect(toJSON(form)).toMatchSnapshot();
  expect(setUsername.called).toBe(true);
});
