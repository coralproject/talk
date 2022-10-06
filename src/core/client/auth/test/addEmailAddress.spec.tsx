import { get } from "lodash";
import sinon from "sinon";

import { ERROR_CODES } from "coral-common/errors";
import { pureMerge } from "coral-common/utils";
import { InvalidRequestError } from "coral-framework/lib/errors";
import {
  act,
  toJSON,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "./create";
import { settings } from "./fixtures";

async function createTestRenderer(
  customResolver: any = {},
  options: { muteNetworkErrors?: boolean; logNetwork?: boolean } = {}
) {
  const resolvers = {
    ...customResolver,
    Query: {
      ...customResolver.Query,
      viewer: sinon.stub().returns({ id: "me", profiles: [] }),
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
    initLocalState: (localRecord) => {
      localRecord.setValue("ADD_EMAIL_ADDRESS", "view");
    },
  });

  return await act(async () => {
    const container = await waitForElement(() =>
      within(testRenderer.root).getByTestID("addEmailAddress-container")
    );
    const main = within(testRenderer.root).getByTestID(/.*-main/);
    const form = within(main).getByType("form");
    const emailAddressField = within(form).getByLabelText("Email address");
    const confirmEmailAddressField = within(form).getByLabelText(
      "Confirm email address"
    );

    return {
      context,
      testRenderer,
      form,
      main,
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
  expect(await within(root).axe()).toHaveNoViolations();
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
  const setEmail = sinon.stub().callsFake((_: any, data: any) => {
    throw new Error("server error");
  });
  const { form, emailAddressField, confirmEmailAddressField } =
    await createTestRenderer(
      {
        Mutation: {
          setEmail,
        },
      },
      { muteNetworkErrors: true }
    );
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
  const setEmail = sinon.stub().callsFake((_: any, data: any) => {
    expectAndFail(data.input).toEqual({
      email,
      clientMutationId: data.input.clientMutationId,
    });
    return {
      user: {
        id: "me",
        email,
      },
      clientMutationId: data.input.clientMutationId,
    };
  });

  const { form, emailAddressField, confirmEmailAddressField } =
    await createTestRenderer({
      Mutation: {
        setEmail,
      },
    });

  const event = { target: { value: email } };

  act(() => emailAddressField.props.onChange(event));
  act(() => confirmEmailAddressField.props.onChange(event));

  await act(() => form.props.onSubmit());

  await wait(() => {
    expect(setEmail.called).toBe(true);
  });
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
    await createTestRenderer(
      {
        Mutation: {
          setEmail,
        },
      },
      { muteNetworkErrors: true }
    );
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
