import { pureMerge } from "talk-common/utils";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import { GQLResolver } from "talk-framework/schema";
import create from "../create";
import { settings, users } from "../fixtures";

beforeEach(() => {
  replaceHistoryLocation("http://localhost/admin/configure/wordList");
});

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(true, "loggedIn");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
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
}

it("renders configure wordList", async () => {
  const { configureContainer } = await createTestRenderer();
  expect(within(configureContainer).toJSON()).toMatchSnapshot();
});

it("change banned and suspect words", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.wordList).toEqual({
          banned: ["Fuck", "Asshole"],
          suspect: ["idiot", "shame"],
        });
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    configureContainer,
    wordListContainer,
    saveChangesButton,
  } = await createTestRenderer({
    resolvers,
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
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});
