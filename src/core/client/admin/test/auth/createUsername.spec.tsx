import { pureMerge } from "talk-common/utils";
import { GQLResolver } from "talk-framework/schema";
import {
  createAccessToken,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  toJSON,
  wait,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import create from "../create";
import { settings } from "../fixtures";

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  replaceHistoryLocation("http://localhost/admin/login");

  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("CREATE_USERNAME", "authView");
      localRecord.setValue(true, "loggedIn");
      localRecord.setValue(createAccessToken(), "accessToken");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
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

it("shows server error", async () => {
  const username = "hans";
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      setUsername: () => {
        throw new Error("server error");
      },
    },
  });
  const { form, usernameField } = await createTestRenderer({
    resolvers,
    muteNetworkErrors: true,
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
});

it("successfully sets username", async () => {
  const username = "hans";
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      setUsername: ({ variables }) => {
        expectAndFail(variables).toEqual({
          username,
        });
        return {
          user: {
            id: "me",
            username,
          },
        };
      },
    },
  });

  const { form, usernameField } = await createTestRenderer({
    resolvers,
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
  expect(resolvers.Mutation!.setUsername!.called).toBe(true);
});
