import sinon from "sinon";

import { ERROR_CODES } from "coral-common/errors";
import { pureMerge } from "coral-common/utils";
import { InvalidRequestError } from "coral-framework/lib/errors";
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
              email: "",
            }),
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("ADD_EMAIL_ADDRESS", "authView");
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
    const emailAddressField = within(form).getByLabelText("Email Address");
    const confirmEmailAddressField = within(form).getByLabelText(
      "Confirm Email Address"
    );

    return {
      context,
      testRenderer,
      form,
      root: testRenderer.root,
      emailAddressField,
      confirmEmailAddressField,
      container,
    };
  });
}

it("renders addEmailAddress view", async () => {
  const { root } = await createTestRenderer();

  await act(async () => {
    await wait(() => {
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
    await wait(() => {
      expect(toJSON(form)).toMatchSnapshot();
    });
  });
});

it("checks for invalid email", async () => {
  const { form, emailAddressField, confirmEmailAddressField } =
    await createTestRenderer();

  act(() =>
    emailAddressField.props.onChange({ target: { value: "invalid-email" } })
  );
  act(() =>
    confirmEmailAddressField.props.onChange({
      target: { value: "invalid-confirmation-email" },
    })
  );

  act(() => {
    form.props.onSubmit();
  });

  await act(async () => {
    await wait(() => {
      expect(toJSON(form)).toMatchSnapshot();
    });
  });
});

it("accepts valid email", async () => {
  const { form, emailAddressField } = await createTestRenderer();

  act(() =>
    emailAddressField.props.onChange({ target: { value: "hans@test.com" } })
  );
  act(() => {
    form.props.onSubmit();
  });

  await act(async () => {
    await wait(() => {
      expect(toJSON(form)).toMatchSnapshot();
    });
  });
});

it("shows server error", async () => {
  const email = "hans@test.com";
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      setEmail: () => {
        throw new Error("server error");
      },
    },
  });

  const { form, emailAddressField, confirmEmailAddressField } =
    await createTestRenderer({
      resolvers,
      muteNetworkErrors: true,
    });
  const submitButton = form.find(
    (i) => i.type === "button" && i.props.type === "submit"
  );

  act(() => emailAddressField.props.onChange({ target: { value: email } }));
  act(() =>
    confirmEmailAddressField.props.onChange({
      target: { value: email },
    })
  );

  act(() => {
    form.props.onSubmit();
  });
  expect(emailAddressField.props.disabled).toBe(true);
  expect(confirmEmailAddressField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await act(async () => {
    await wait(() => {
      expect(submitButton.props.disabled).toBe(false);
    });
  });
  expect(toJSON(form)).toMatchSnapshot();
});

it("successfully sets email", async () => {
  const email = "hans@test.com";
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      setEmail: ({ variables }) => {
        expectAndFail(variables).toEqual({
          email,
        });
        return {
          user: {
            id: "me",
            email,
          },
        };
      },
    },
  });

  const { form, emailAddressField, confirmEmailAddressField } =
    await createTestRenderer({
      resolvers,
    });
  const submitButton = form.find(
    (i) => i.type === "button" && i.props.type === "submit"
  );

  act(() => emailAddressField.props.onChange({ target: { value: email } }));
  act(() =>
    confirmEmailAddressField.props.onChange({
      target: { value: email },
    })
  );

  act(() => {
    form.props.onSubmit();
  });
  expect(emailAddressField.props.disabled).toBe(true);
  expect(confirmEmailAddressField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await act(async () => {
    await wait(() => {
      expect(submitButton.props.disabled).toBe(false);
    });
  });

  expect(toJSON(form)).toMatchSnapshot();
  expect(resolvers.Mutation!.setEmail!.called).toBe(true);
});

it("switch to link account", async () => {
  const email = "hans@test.com";
  const setEmail = sinon.stub().callsFake((_: any, data: any) => {
    throw new InvalidRequestError({
      code: ERROR_CODES.DUPLICATE_EMAIL,
      traceID: "traceID",
    });
  });
  const { testRenderer, form, emailAddressField, confirmEmailAddressField } =
    await createTestRenderer({
      resolvers: {
        Mutation: {
          setEmail,
        },
      },
      muteNetworkErrors: true,
    });
  const submitButton = form.find(
    (i) => i.type === "button" && i.props.type === "submit"
  );

  act(() => emailAddressField.props.onChange({ target: { value: email } }));
  act(() =>
    confirmEmailAddressField.props.onChange({
      target: { value: email },
    })
  );

  act(() => {
    form.props.onSubmit();
  });
  expect(emailAddressField.props.disabled).toBe(true);
  expect(confirmEmailAddressField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await act(async () => {
    await waitForElement(() =>
      within(testRenderer.root).getByTestID("linkAccount-container")
    );
  });
});
