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
  replaceHistoryLocation("http://localhost/admin/configure/advanced");
});

const createTestRenderer = async (resolver: any = {}) => {
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
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(true, "loggedIn");
    },
  });
  const configureContainer = await waitForElement(() =>
    within(testRenderer.root).getByTestID("configure-container")
  );
  const advancedContainer = await waitForElement(() =>
    within(configureContainer).getByTestID("configure-advancedContainer")
  );
  const saveChangesButton = within(configureContainer).getByTestID(
    "configure-sideBar-saveChanges"
  );
  return {
    testRenderer,
    configureContainer,
    advancedContainer,
    saveChangesButton,
  };
};

it("renders configure advanced", async () => {
  const { configureContainer } = await createTestRenderer();
  expect(within(configureContainer).toJSON()).toMatchSnapshot();
});

it("change custom css", async () => {
  let settingsRecord = cloneDeep(settings);
  const updateSettingsStub = createSinonStub(s =>
    s.onFirstCall().callsFake((_: any, data: any) => {
      expectAndFail(data.input.settings.customCSSURL).toEqual("./custom.css");
      settingsRecord = merge(settingsRecord, data.input.settings);
      return {
        settings: settingsRecord,
        clientMutationId: data.input.clientMutationId,
      };
    })
  );
  const {
    configureContainer,
    advancedContainer,
    saveChangesButton,
  } = await createTestRenderer({
    Mutation: {
      updateSettings: updateSettingsStub,
    },
  });

  const customCSSField = within(advancedContainer).getByLabelText("Custom CSS");

  // Let's change the customCSS field.
  customCSSField.props.onChange("./custom.css");

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(customCSSField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(customCSSField.props.disabled).toBe(false);
  });

  // Should have successfully sent with server.
  expect(updateSettingsStub.called).toBe(true);
});

it("change permitted domains to be empty", async () => {
  let settingsRecord = cloneDeep(settings);
  const updateSettingsStub = createSinonStub(s =>
    s.onFirstCall().callsFake((_: any, data: any) => {
      expectAndFail(data.input.settings.domains).toEqual([]);
      settingsRecord = merge(settingsRecord, data.input.settings);
      return {
        settings: settingsRecord,
        clientMutationId: data.input.clientMutationId,
      };
    })
  );
  const {
    configureContainer,
    advancedContainer,
    saveChangesButton,
  } = await createTestRenderer({
    Mutation: {
      updateSettings: updateSettingsStub,
    },
  });

  const permittedDomainsField = within(advancedContainer).getByLabelText(
    "Permitted Domains"
  );

  // Let's change the permitted domains.
  permittedDomainsField.props.onChange("");

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(permittedDomainsField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(permittedDomainsField.props.disabled).toBe(false);
  });

  // Should have successfully sent with server.
  expect(updateSettingsStub.called).toBe(true);
});

it("change permitted domains to include more domains", async () => {
  let settingsRecord = cloneDeep(settings);
  const updateSettingsStub = createSinonStub(s =>
    s.onFirstCall().callsFake((_: any, data: any) => {
      expectAndFail(data.input.settings.domains).toEqual([
        "localhost:8080",
        "localhost:3000",
      ]);
      settingsRecord = merge(settingsRecord, data.input.settings);
      return {
        settings: settingsRecord,
        clientMutationId: data.input.clientMutationId,
      };
    })
  );
  const {
    configureContainer,
    advancedContainer,
    saveChangesButton,
  } = await createTestRenderer({
    Mutation: {
      updateSettings: updateSettingsStub,
    },
  });

  const permittedDomainsField = within(advancedContainer).getByLabelText(
    "Permitted Domains"
  );

  // Let's change the permitted domains.
  permittedDomainsField.props.onChange("localhost:8080, localhost:3000");

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(permittedDomainsField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(permittedDomainsField.props.disabled).toBe(false);
  });

  // Should have successfully sent with server.
  expect(updateSettingsStub.called).toBe(true);
});
