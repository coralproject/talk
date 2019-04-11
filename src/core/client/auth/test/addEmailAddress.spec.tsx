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
      localRecord.setValue("ADD_EMAIL_ADDRESS", "view");
    },
  });
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("addEmailAddress-container")
  );
  const main = within(testRenderer.root).getByTestID(/.*-main/);
  const form = within(main).getByType("form");
  const emailAddressField = within(form).getByLabelText("Email Address");
  const confirmEmailAddressField = within(form).getByLabelText(
    "Confirm Email Address"
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
}

beforeEach(async () => {
  windowMock = mockWindow();
});

afterEach(async () => {
  await wait(() => expect(windowMock.resizeStub.called).toBe(true));
  windowMock.restore();
});

it("renders addEmailAddress view", async () => {
  const { root } = await createTestRenderer();
  expect(toJSON(root)).toMatchSnapshot();
});

it("shows error when submitting empty form", async () => {
  const { form } = await createTestRenderer();
  form.props.onSubmit();
  expect(toJSON(form)).toMatchSnapshot();
});

it("checks for invalid email", async () => {
  const {
    form,
    emailAddressField,
    confirmEmailAddressField,
  } = await createTestRenderer();
  emailAddressField.props.onChange({ target: { value: "invalid-email" } });
  confirmEmailAddressField.props.onChange({
    target: { value: "invalid-confirmation-email" },
  });
  form.props.onSubmit();
  expect(toJSON(form)).toMatchSnapshot();
});

it("accepts valid email", async () => {
  const { form, emailAddressField } = await createTestRenderer();
  emailAddressField.props.onChange({ target: { value: "hans@test.com" } });
  form.props.onSubmit();
  expect(toJSON(form)).toMatchSnapshot();
});

it("shows server error", async () => {
  const email = "hans@test.com";
  const setEmail = sinon.stub().callsFake((_: any, data: any) => {
    throw new Error("server error");
  });
  const {
    form,
    emailAddressField,
    confirmEmailAddressField,
  } = await createTestRenderer(
    {
      Mutation: {
        setEmail,
      },
    },
    { muteNetworkErrors: true }
  );
  const submitButton = form.find(
    i => i.type === "button" && i.props.type === "submit"
  );

  emailAddressField.props.onChange({ target: { value: email } });
  confirmEmailAddressField.props.onChange({
    target: { value: email },
  });

  form.props.onSubmit();
  expect(emailAddressField.props.disabled).toBe(true);
  expect(confirmEmailAddressField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

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
  const {
    form,
    emailAddressField,
    confirmEmailAddressField,
  } = await createTestRenderer({
    Mutation: {
      setEmail,
    },
  });
  const submitButton = form.find(
    i => i.type === "button" && i.props.type === "submit"
  );

  emailAddressField.props.onChange({ target: { value: email } });
  confirmEmailAddressField.props.onChange({
    target: { value: email },
  });

  form.props.onSubmit();
  expect(emailAddressField.props.disabled).toBe(true);
  expect(confirmEmailAddressField.props.disabled).toBe(true);
  expect(submitButton.props.disabled).toBe(true);

  await wait(() => expect(submitButton.props.disabled).toBe(false));

  expect(toJSON(form)).toMatchSnapshot();
  expect(setEmail.called).toBe(true);
});
