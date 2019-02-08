import { get, merge } from "lodash";
import sinon from "sinon";

import {
  createAccessToken,
  replaceHistoryLocation,
  toJSON,
  wait,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import create from "../create";
import { settings } from "../fixtures";

async function createTestRenderer(
  customResolver: any = {},
  options: { muteNetworkErrors?: boolean; logNetwork?: boolean } = {}
) {
  replaceHistoryLocation("http://localhost/admin/login");
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
    logNetwork: options.logNetwork,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue("CREATE_USERNAME", "authView");
      localRecord.setValue(true, "loggedIn");
      localRecord.setValue(createAccessToken(), "accessToken");
    },
  });
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("completeAccountBox")
  );
  const form = within(container).getByType("form");
  const usernameField = within(form).getByLabelText("Username");

  return {
    context,
    testRenderer,
    form,
    root: testRenderer.root,
    usernameField,
    container,
  };
}

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

it("accepts valid username", async () => {
  const { form, usernameField } = await createTestRenderer();
  usernameField.props.onChange({ target: { value: "hans" } });
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
    expect(data.input).toEqual({
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
