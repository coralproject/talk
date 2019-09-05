import { pureMerge } from "coral-common/utils";
import { GQLMODERATION_MODE, GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import { settings, users } from "../fixtures";

beforeEach(() => {
  replaceHistoryLocation("http://localhost/admin/configure/moderation");
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
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  const configureContainer = await waitForElement(() =>
    within(testRenderer.root).getByTestID("configure-container")
  );
  const moderationContainer = await waitForElement(() =>
    within(configureContainer).getByTestID("configure-moderationContainer")
  );
  const saveChangesButton = within(configureContainer).getByTestID(
    "configure-sideBar-saveChanges"
  );
  return {
    testRenderer,
    configureContainer,
    moderationContainer,
    saveChangesButton,
  };
}

it("renders configure moderation", async () => {
  const { configureContainer } = await createTestRenderer();
  expect(within(configureContainer).toJSON()).toMatchSnapshot();
});

it("change site wide pre-moderation", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.moderation).toEqual(
          GQLMODERATION_MODE.PRE
        );
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    configureContainer,
    moderationContainer,
    saveChangesButton,
  } = await createTestRenderer({
    resolvers,
  });

  const preModerationContainer = within(moderationContainer).getAllByText(
    "Pre-moderate all comments sitewide",
    { selector: "fieldset" }
  )[0];

  const onField = within(preModerationContainer).getByLabelText("On");

  // Let's enable it.
  onField.props.onChange(onField.props.value.toString());

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
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("change site wide link pre-moderation", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.premodLinksEnable).toEqual(true);
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    configureContainer,
    moderationContainer,
    saveChangesButton,
  } = await createTestRenderer({
    resolvers,
  });

  const preModerationContainer = within(moderationContainer).getAllByText(
    "Pre-moderate comments containing links sitewide",
    { selector: "fieldset" }
  )[0];

  const onField = within(preModerationContainer).getByLabelText("On");

  // Let's enable it.
  onField.props.onChange(onField.props.value.toString());

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
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("change akismet settings", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.integrations!.akismet).toEqual({
          enabled: true,
          key: "my api key",
          site: "https://coralproject.net",
        });
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    configureContainer,
    moderationContainer,
    saveChangesButton,
  } = await createTestRenderer({ resolvers });

  const akismetContainer = within(moderationContainer).getByText(
    "Akismet spam detection filter",
    { selector: "fieldset" }
  );

  const onField = within(akismetContainer).getByLabelText("On");
  const keyField = within(akismetContainer).getByLabelText("API key");
  const siteField = within(akismetContainer).getByLabelText("Site URL");

  // Let's turn it on.
  onField.props.onChange(onField.props.value.toString());

  expect(saveChangesButton.props.disabled).toBe(false);

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  expect(
    within(akismetContainer).queryAllByText("This field is required.").length
  ).toBe(2);

  // Input valid api key
  keyField.props.onChange("my api key");

  // Input correct site.
  siteField.props.onChange("https://coralproject.net");

  expect(within(akismetContainer).queryAllByText("Invalid URL").length).toBe(0);

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
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("change perspective settings", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables, callCount }) => {
        switch (callCount) {
          case 0:
            expectAndFail(variables.settings.integrations!.perspective).toEqual(
              {
                doNotStore: false,
                enabled: true,
                endpoint: "https://custom-endpoint.net",
                key: "my api key",
                model: null,
                threshold: 0.1,
              }
            );
            break;
          default:
            expectAndFail(
              variables.settings.integrations!.perspective!.threshold
            ).toBeNull();
        }
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    configureContainer,
    moderationContainer,
    saveChangesButton,
  } = await createTestRenderer({ resolvers });

  const perspectiveContainer = within(moderationContainer).getByText(
    "Perspective toxic comment filter",
    { selector: "fieldset" }
  );

  const onField = within(perspectiveContainer).getByLabelText("On");
  const allowField = within(perspectiveContainer).getByLabelText("Allow");
  const keyField = within(perspectiveContainer).getByLabelText("API key");
  const thresholdField = within(perspectiveContainer).getByLabelText(
    "Toxicity threshold"
  );
  const endpointField = within(perspectiveContainer).getByLabelText(
    "Custom endpoint"
  );

  // Let's turn it on.
  onField.props.onChange(onField.props.value.toString());
  allowField.props.onChange(allowField.props.value.toString());

  expect(saveChangesButton.props.disabled).toBe(false);

  // Send form
  within(configureContainer)
    .getByType("form")
    .props.onSubmit();

  expect(
    within(perspectiveContainer).queryAllByText("This field is required.")
      .length
  ).toBe(1);

  // Input valid api key
  keyField.props.onChange("my api key");

  // Input malformed endpoint.
  endpointField.props.onChange("malformed url");

  // Input malformed threshold.
  thresholdField.props.onChange("abc");

  expect(
    within(perspectiveContainer).queryAllByText("This field is required.")
      .length
  ).toBe(0);
  expect(
    within(perspectiveContainer).queryAllByText("Invalid URL").length
  ).toBe(1);
  expect(
    within(perspectiveContainer).queryAllByText(
      "Please enter a whole number between 0 and 100."
    ).length
  ).toBe(1);

  // Input correct site.
  endpointField.props.onChange("https://custom-endpoint.net");

  // Input valid threshold.
  thresholdField.props.onChange(10);

  expect(
    within(perspectiveContainer).queryAllByText("Invalid URL").length
  ).toBe(0);

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
  expect(resolvers.Mutation!.updateSettings!.calledOnce).toBe(true);

  // Use default threshold.
  thresholdField.props.onChange("");

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
  expect(resolvers.Mutation!.updateSettings!.calledTwice).toBe(true);
});
