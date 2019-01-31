import mockConsole from "jest-mock-console";
import { cloneDeep, get, merge } from "lodash";
import sinon from "sinon";

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
  // Test might pass even when it fails with errors in the log due to:
  // https://github.com/facebook/jest/issues/3917
  // We check the console to be error free..
  mockConsole();
});

afterEach(() => {
  // Check that there are no errors in the console.
  // tslint:disable-next-line: no-console
  expect(console.error).not.toHaveBeenCalled();
});

const createTestRenderer = async (resolver: any = {}) => {
  const resolvers = {
    ...resolver,
    Query: {
      ...resolver.Query,
      settings: sinon
        .stub()
        .returns(merge({}, settings, get(resolver, "Query.settings"))),
      me: sinon.stub().returns(users[0]),
    },
  };
  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
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

it("change community guidlines", async () => {
  let settingsRecord = cloneDeep(settings);
  const updateSettingsStub = createSinonStub(s =>
    s.onFirstCall().callsFake((_: any, data: any) => {
      expect(data.input.settings.communityGuidelines).toEqual(
        "This is the community guidlines summary"
      );
      expect(data.input.settings.communityGuidelinesEnable).toEqual(true);
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
      expect(data.input.settings.closedMessage).toEqual(
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
      expect(data.input.settings.editCommentWindowLength).toEqual(20000);
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

  const timeField = within(generalContainer).getByLabelText(
    "Comment Edit Timeframe"
  );

  // Let's change the time to sth invalid.
  timeField.props.onChange("invalid");

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  expect(within(configureContainer).toJSON()).toMatchSnapshot();

  expect(
    within(generalContainer).queryAllByText(
      "Please enter a valid whole number >= 0"
    ).length
  ).toBe(1);

  // Let's change the time to sth valid.
  timeField.props.onChange("20000");

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

  // Wait for submission to be finished
  await wait(() => {
    expect(updateSettingsStub.called).toBe(true);
  });
});

it("change comment length limitations", async () => {
  let settingsRecord = cloneDeep(settings);
  const updateSettingsStub = createSinonStub(s =>
    s.onFirstCall().callsFake((_: any, data: any) => {
      expect(data.input.settings.charCount).toEqual({
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
      "Please enter a valid whole number >= 0"
    ).length
  ).toBe(2);

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
      expect(data.input.settings.autoCloseStream).toEqual(true);
      expect(data.input.settings.closedTimeout).toEqual(2592000);
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
