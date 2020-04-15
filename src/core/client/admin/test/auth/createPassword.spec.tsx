import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  toJSON,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import { settings, users } from "../fixtures";

const viewer = users.admins[0];

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
          viewer: () =>
            pureMerge<typeof viewer>(viewer, {
              profiles: [],
            }),
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("CREATE_PASSWORD", "authView");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });

  return await act(async () => {
    const container = await waitForElement(() =>
      within(testRenderer.root).getByTestID("completeAccountBox")
    );
    const form = within(container).getByType("form");
    const passwordField = within(form).getByLabelText("Password");

    return {
      context,
      testRenderer,
      form,
      root: testRenderer.root,
      passwordField,
      container,
    };
  });
}

it("renders createPassword view", async () => {
  const { root } = await createTestRenderer();

  await act(async () => {
    await wait(async () => {
      expect(toJSON(root)).toMatchSnapshot();
    });
  });
});

it("shows error when submitting empty form", async () => {
  const { form } = await createTestRenderer();

  act(() => {
    form.props.onSubmit();
  });

  await act(async () => {
    await wait(async () => {
      expect(toJSON(form)).toMatchSnapshot();
    });
  });
});

it("checks for invalid password", async () => {
  const { form, passwordField } = await createTestRenderer();

  act(() => passwordField.props.onChange({ target: { value: "x" } }));
  act(() => {
    form.props.onSubmit();
  });

  await act(async () => {});
  expect(toJSON(form)).toMatchSnapshot();
});

it("shows server error", async () => {
  const password = "secretpassword";
  const resolvers = await act(async () => {
    return createResolversStub<GQLResolver>({
      Mutation: {
        setPassword: () => {
          throw new Error("server error");
        },
      },
    });
  });
  const { form, passwordField } = await createTestRenderer({
    resolvers,
    muteNetworkErrors: true,
  });
  const submitButton = form.find(
    (i) => i.type === "button" && i.props.type === "submit"
  );

  act(() => passwordField.props.onChange({ target: { value: password } }));

  act(() => {
    form.props.onSubmit();
  });
  expect(passwordField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await act(async () => {
    await wait(() => expect(submitButton.props.disabled).toBe(false));
  });
  expect(toJSON(form)).toMatchSnapshot();
});

it("successfully sets password", async () => {
  const password = "secretpassword";
  const resolvers = await act(async () => {
    return createResolversStub<GQLResolver>({
      Mutation: {
        setPassword: ({ variables }) => {
          expectAndFail(variables).toEqual({
            password,
          });
          return {
            user: {
              id: "me",
              profiles: [],
            },
          };
        },
      },
    });
  });
  const { form, passwordField } = await createTestRenderer({
    resolvers,
  });
  const submitButton = form.find(
    (i) => i.type === "button" && i.props.type === "submit"
  );

  act(() => passwordField.props.onChange({ target: { value: password } }));

  act(() => {
    form.props.onSubmit();
  });
  expect(passwordField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await act(async () => {
    await wait(() => expect(submitButton.props.disabled).toBe(false));
  });
  expect(toJSON(form)).toMatchSnapshot();
  expect(resolvers.Mutation!.setPassword!.called).toBe(true);
});
