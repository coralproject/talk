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
  replaceHistoryLocation("http://localhost/admin/configure/wordList");
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
  const wordListContainer = await waitForElement(() =>
    within(configureContainer).getByTestID("configure-wordListContainer")
  );
  const saveChangesButton = within(configureContainer).getByTestID(
    "configure-sideBar-saveChanges"
  );
  return {
    testRenderer,
    configureContainer,
    wordListContainer,
    saveChangesButton,
  };
};

it("renders configure wordList", async () => {
  const { configureContainer } = await createTestRenderer();
  expect(within(configureContainer).toJSON()).toMatchSnapshot();
});

it("change banned and suspect words", async () => {
  let settingsRecord = cloneDeep(settings);
  const updateSettingsStub = createSinonStub(s =>
    s.onFirstCall().callsFake((_: any, data: any) => {
      expectAndFail(data.input.settings.wordList).toEqual({
        banned: ["Fuck", "Asshole"],
        suspect: ["idiot", "shame"],
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
    wordListContainer,
    saveChangesButton,
  } = await createTestRenderer({
    Mutation: {
      updateSettings: updateSettingsStub,
    },
  });

  const bannedField = within(wordListContainer).getByLabelText(
    "Banned Word List"
  );
  const suspectField = within(wordListContainer).getByLabelText(
    "Suspect Word List"
  );

  // Let's change the wordlist contents.
  bannedField.props.onChange("Fuck\nAsshole");
  suspectField.props.onChange("idiot\nshame");

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(bannedField.props.disabled).toBe(true);
  expect(suspectField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await wait(() => {
    expect(bannedField.props.disabled).toBe(false);
    expect(suspectField.props.disabled).toBe(false);
  });

  // Should have successfully sent with server.
  expect(updateSettingsStub.called).toBe(true);
});
