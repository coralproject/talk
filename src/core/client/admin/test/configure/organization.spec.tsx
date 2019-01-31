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
  replaceHistoryLocation("http://localhost/admin/configure/organization");
  // Test might pass even when it fails with errors in the log due to:
  // https://github.com/facebook/jest/issues/3917
  // We check the console to be error free..
  mockConsole("error");
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
  const organizationContainer = await waitForElement(() =>
    within(configureContainer).getByTestID("configure-organizationContainer")
  );
  const saveChangesButton = within(configureContainer).getByTestID(
    "configure-sideBar-saveChanges"
  );
  return {
    testRenderer,
    configureContainer,
    organizationContainer,
    saveChangesButton,
  };
};

it("renders configure organization", async () => {
  const { configureContainer } = await createTestRenderer();
  expect(within(configureContainer).toJSON()).toMatchSnapshot();
});

it("change organization name", async () => {
  let settingsRecord = cloneDeep(settings);
  const updateSettingsStub = createSinonStub(s =>
    s.onFirstCall().callsFake((_: any, data: any) => {
      expect(data.input.settings.organizationName).toEqual("Coral Test");
      settingsRecord = merge(settingsRecord, data.input.settings);
      return {
        settings: settingsRecord,
        clientMutationId: data.input.clientMutationId,
      };
    })
  );
  const {
    configureContainer,
    organizationContainer,
    saveChangesButton,
  } = await createTestRenderer({
    Mutation: {
      updateSettings: updateSettingsStub,
    },
  });

  const organizationNameField = within(organizationContainer).getByLabelText(
    "Organization Name"
  );

  // Let's change some organization name.
  organizationNameField.props.onChange("");

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  // Should show validation error.
  within(organizationContainer).getByText("This field is required.");

  // Let's change to some valid organization name.
  organizationNameField.props.onChange("Coral Test");

  // Should not show validation error.
  expect(
    within(organizationContainer).queryByText("This field is required.")
  ).toBeNull();

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(organizationNameField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(organizationNameField.props.disabled).toBe(false);
  });

  // Should have successfully sent with server.
  expect(updateSettingsStub.called).toBe(true);
});

it("change organization contact email", async () => {
  let settingsRecord = cloneDeep(settings);
  const updateSettingsStub = createSinonStub(s =>
    s.onFirstCall().callsFake((_: any, data: any) => {
      expect(data.input.settings.organizationContactEmail).toEqual(
        "test@coralproject.net"
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
    organizationContainer,
    saveChangesButton,
  } = await createTestRenderer({
    Mutation: {
      updateSettings: updateSettingsStub,
    },
  });

  const organizationEmailField = within(organizationContainer).getByLabelText(
    "Organization Email"
  );

  // Let's change some organization name.
  organizationEmailField.props.onChange("");

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  // Should show validation error.
  within(organizationContainer).getByText("This field is required.");

  // Let's change to some valid organization name.
  organizationEmailField.props.onChange("test@coralproject.net");

  // Should not show validation error.
  expect(
    within(organizationContainer).queryByText("This field is required.")
  ).toBeNull();

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(organizationEmailField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(organizationEmailField.props.disabled).toBe(false);
  });

  // Should have successfully sent with server.
  expect(updateSettingsStub.called).toBe(true);
});
