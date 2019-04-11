import { pureMerge } from "talk-common/utils";
import { GQLResolver } from "talk-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
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

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context } = create({
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
  const advancedContainer = await waitForElement(() =>
    within(configureContainer).getByTestID("configure-advancedContainer")
  );
  const saveChangesButton = within(configureContainer).getByTestID(
    "configure-sideBar-saveChanges"
  );
  return {
    context,
    testRenderer,
    configureContainer,
    advancedContainer,
    saveChangesButton,
  };
}

it("renders configure advanced", async () => {
  const { configureContainer } = await createTestRenderer();
  expect(within(configureContainer).toJSON()).toMatchSnapshot();
});

it("change custom css", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.customCSSURL).toEqual("./custom.css");
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    configureContainer,
    advancedContainer,
    saveChangesButton,
  } = await createTestRenderer({
    resolvers,
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
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("change permitted domains to be empty", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.domains).toEqual([]);
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    configureContainer,
    advancedContainer,
    saveChangesButton,
  } = await createTestRenderer({
    resolvers,
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
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("change permitted domains to include more domains", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.domains).toEqual([
          "localhost:8080",
          "localhost:3000",
        ]);
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    configureContainer,
    advancedContainer,
    saveChangesButton,
  } = await createTestRenderer({
    resolvers,
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
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});
