import { cloneDeep, get, merge } from "lodash";
import sinon from "sinon";

import { ERROR_CODES } from "talk-common/errors";
import { InvalidRequestError } from "talk-framework/lib/errors";
import {
  createSinonStub,
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import create from "../create";
import { settings, users } from "../fixtures";

beforeEach(() => {
  replaceHistoryLocation("http://localhost/admin/configure/general");
});

const createTestRenderer = async (
  resolver: any = {},
  options: { muteNetworkErrors?: boolean } = {}
) => {
  const resolvers = {
    ...resolver,
    Query: {
      ...resolver.Query,
      settings: sinon
        .stub()
        .returns(merge({}, settings, get(resolver, "Query.settings"))),
      viewer: sinon.stub().returns(users.admins[0]),
    },
  };
  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    muteNetworkErrors: options.muteNetworkErrors,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(true, "loggedIn");
    },
  });
  const configureContainer = await waitForElement(() =>
    within(testRenderer.root).getByTestID("configure-container")
  );
  const generalContainer = await waitForElement(() =>
    within(configureContainer).getByTestID("configure-generalContainer")
  );
  const saveChangesButton = within(configureContainer).getByTestID(
    "configure-sideBar-saveChanges"
  );
  return {
    testRenderer,
    configureContainer,
    generalContainer,
    saveChangesButton,
  };
};

it("renders configure general", async () => {
  const { configureContainer } = await createTestRenderer();
  expect(within(configureContainer).toJSON()).toMatchSnapshot();
});

it("change site wide commenting", async () => {
  let settingsRecord = cloneDeep(settings);
  const updateSettingsStub = createSinonStub(s =>
    s.onFirstCall().callsFake((_: any, data: any) => {
      expectAndFail(data.input.settings.disableCommenting).toEqual({
        enabled: true,
        message: "Closing message",
      });
      settingsRecord = merge(settingsRecord, data.input.settings);
      return {
        settings: settingsRecord,
        clientMutationId: data.input.clientMutationId,
      };
    })
  );
  const {
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({
    Mutation: {
      updateSettings: updateSettingsStub,
    },
  });

  const sitewideCommentingContainer = within(generalContainer).getAllByText(
    "Sitewide Commenting",
    { selector: "fieldset" }
  )[0];

  const offField = within(sitewideCommentingContainer).getByLabelText(
    "Off - Comment streams closed for new comments"
  );
  const contentField = within(sitewideCommentingContainer).getByLabelText(
    "Sitewide Closed Comments Message"
  );

  // Let's enable it.
  offField.props.onChange(offField.props.value.toString());

  // Let's change the content.
  contentField.props.onChange("Closing message");

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(offField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(offField.props.disabled).toBe(false);
  });

  // Should have successfully sent with server.
  expect(updateSettingsStub.called).toBe(true);
});

it("change community guidlines", async () => {
  let settingsRecord = cloneDeep(settings);
  const updateSettingsStub = createSinonStub(s =>
    s.onFirstCall().callsFake((_: any, data: any) => {
      expectAndFail(data.input.settings.communityGuidelines.content).toEqual(
        "This is the community guidlines summary"
      );
      expectAndFail(data.input.settings.communityGuidelines.enabled).toEqual(
        true
      );
      settingsRecord = merge(settingsRecord, data.input.settings);
      return {
        settings: settingsRecord,
        clientMutationId: data.input.clientMutationId,
      };
    })
  );
  const {
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({
    Mutation: {
      updateSettings: updateSettingsStub,
    },
  });

  const guidelinesContainer = within(generalContainer).getAllByText(
    "Community Guidelines Summary",
    { selector: "fieldset" }
  )[0];

  const onField = within(guidelinesContainer).getByLabelText("On");
  const contentField = within(guidelinesContainer).getByLabelText(
    "Community Guidelines Summary"
  );

  // Let's enable it.
  onField.props.onChange(onField.props.value.toString());

  // Let's change the content.
  contentField.props.onChange("This is the community guidlines summary");

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(onField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(onField.props.disabled).toBe(false);
  });

  // Should have successfully sent with server.
  expect(updateSettingsStub.called).toBe(true);
});

it("change closed stream message", async () => {
  let settingsRecord = cloneDeep(settings);
  const updateSettingsStub = createSinonStub(s =>
    s.onFirstCall().callsFake((_: any, data: any) => {
      expectAndFail(data.input.settings.closeCommenting.message).toEqual(
        "The stream has been closed"
      );
      settingsRecord = merge(settingsRecord, data.input.settings);
      return {
        settings: settingsRecord,
        clientMutationId: data.input.clientMutationId,
      };
    })
  );
  const {
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({
    Mutation: {
      updateSettings: updateSettingsStub,
    },
  });

  const contentField = within(generalContainer).getByLabelText(
    "Closed Stream Message"
  );

  // Let's change the content.
  contentField.props.onChange("The stream has been closed");

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(updateSettingsStub.called).toBe(true);
  });
});

it("change comment editing time", async () => {
  let settingsRecord = cloneDeep(settings);
  const updateSettingsStub = createSinonStub(s =>
    s.onFirstCall().callsFake((_: any, data: any) => {
      expectAndFail(data.input.settings.editCommentWindowLength).toEqual(
        108000
      );
      settingsRecord = merge(settingsRecord, data.input.settings);
      return {
        settings: settingsRecord,
        clientMutationId: data.input.clientMutationId,
      };
    })
  );
  const {
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({
    Mutation: {
      updateSettings: updateSettingsStub,
    },
  });

  const durationFieldset = within(generalContainer).getByText(
    "Comment Edit Timeframe",
    { selector: "fieldset" }
  );
  const valueField = within(durationFieldset).getByLabelText("value");
  const unitField = within(durationFieldset).getByLabelText("unit");
  const hoursOption = within(unitField).getByText(/Hours?/);

  // Let's turn on and set some invalid values.
  valueField.props.onChange({ target: { value: "" } });

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  expect(
    within(generalContainer).queryAllByText("This field is required.").length
  ).toBe(1);

  // Let's change to sth valid.
  valueField.props.onChange({ target: { value: "30" } });
  unitField.props.onChange({
    target: { value: hoursOption.props.value.toString() },
  });

  expect(
    within(generalContainer).queryAllByText(
      "Please enter a whole number greater than or equal to 0"
    ).length
  ).toBe(0);

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(updateSettingsStub.called).toBe(true);
  });
});

it("change comment length limitations", async () => {
  let settingsRecord = cloneDeep(settings);
  const updateSettingsStub = createSinonStub(s =>
    s.onFirstCall().callsFake((_: any, data: any) => {
      expectAndFail(data.input.settings.charCount).toEqual({
        enabled: true,
        min: null,
        max: 3000,
      });
      settingsRecord = merge(settingsRecord, data.input.settings);
      return {
        settings: settingsRecord,
        clientMutationId: data.input.clientMutationId,
      };
    })
  );
  const {
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({
    Mutation: {
      updateSettings: updateSettingsStub,
    },
  });

  const commentLengthContainer = within(generalContainer).getByText(
    "Comment Length",
    { selector: "fieldset" }
  );
  const onField = within(commentLengthContainer).getByLabelText("On");
  const minField = within(commentLengthContainer).getByLabelText(
    "Minimum Comment Length"
  );
  const maxField = within(commentLengthContainer).getByLabelText(
    "Maximum Comment Length"
  );

  // Let's turn on and set some invalid values.
  onField.props.onChange(onField.props.value.toString());
  minField.props.onChange("invalid");
  maxField.props.onChange("-1");

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  expect(
    within(generalContainer).queryAllByText(
      "Please enter a whole number greater than 0"
    ).length
  ).toBe(2);

  // Make max smaller than min.
  minField.props.onChange("1000");
  maxField.props.onChange("500");

  expect(
    within(generalContainer).queryAllByText(
      "Please enter a number longer than the minimum length"
    ).length
  ).toBe(1);

  // Let's change to sth valid.
  minField.props.onChange("");
  maxField.props.onChange("3000");

  expect(
    within(generalContainer).queryAllByText(
      "Please enter a valid whole number >= 0"
    ).length
  ).toBe(0);

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(minField.props.disabled).toBe(true);
  expect(maxField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(minField.props.disabled).toBe(false);
    expect(maxField.props.disabled).toBe(false);
  });
  expect(updateSettingsStub.called).toBe(true);
});

it("change closing comment streams", async () => {
  let settingsRecord = cloneDeep(settings);
  const updateSettingsStub = createSinonStub(s =>
    s.onFirstCall().callsFake((_: any, data: any) => {
      expectAndFail(data.input.settings.closeCommenting.auto).toEqual(true);
      expectAndFail(data.input.settings.closeCommenting.timeout).toEqual(
        2592000
      );
      settingsRecord = merge(settingsRecord, data.input.settings);
      return {
        settings: settingsRecord,
        clientMutationId: data.input.clientMutationId,
      };
    })
  );
  const {
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({
    Mutation: {
      updateSettings: updateSettingsStub,
    },
  });

  const closingCommentStreamsContainer = within(generalContainer).getByText(
    "Closing Comment Streams",
    { selector: "fieldset" }
  );
  const onField = within(closingCommentStreamsContainer).getByLabelText("On");
  const durationFieldset = within(closingCommentStreamsContainer).getByText(
    "Close Comments After",
    { selector: "fieldset" }
  );
  const valueField = within(durationFieldset).getByLabelText("value");
  const unitField = within(durationFieldset).getByLabelText("unit");
  const daysOption = within(unitField).getByText(/Days?/);

  // Let's turn on and set some invalid values.
  onField.props.onChange(onField.props.value.toString());
  valueField.props.onChange({ target: { value: "" } });

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  expect(
    within(generalContainer).queryAllByText("This field is required.").length
  ).toBe(1);

  // Let's change to sth valid.
  valueField.props.onChange({ target: { value: "30" } });
  unitField.props.onChange({
    target: { value: daysOption.props.value.toString() },
  });

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(valueField.props.disabled).toBe(true);
  expect(unitField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(valueField.props.disabled).toBe(false);
    expect(unitField.props.disabled).toBe(false);
  });
  expect(updateSettingsStub.called).toBe(true);
});

it("handle server error", async () => {
  const updateSettingsStub = createSinonStub(s =>
    s.onFirstCall().callsFake((_: any, data: any) => {
      throw new InvalidRequestError({ code: ERROR_CODES.INTERNAL_ERROR });
    })
  );
  const { configureContainer, generalContainer } = await createTestRenderer(
    {
      Mutation: {
        updateSettings: updateSettingsStub,
      },
    },
    { muteNetworkErrors: true }
  );

  const contentField = within(generalContainer).getByLabelText(
    "Closed Stream Message"
  );

  // Let's change the content.
  contentField.props.onChange("The stream has been closed");

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  // Look for internal error being displayed.
  await waitForElement(() =>
    within(configureContainer).getByText("INTERNAL_ERROR")
  );
});
