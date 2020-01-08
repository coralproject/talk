import { pureMerge } from "coral-common/utils";
import { GQLMODERATION_MODE, GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  findParentWithType,
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
  params: CreateTestRendererParams<GQLResolver> = {},
  settingsOverride?: any
) {
  const { testRenderer } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => (settingsOverride ? settingsOverride : settings),
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
  const { moderationContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const preModerationContainer = within(moderationContainer).getAllByText(
    "Pre-moderate all comments sitewide",
    { selector: "fieldset" }
  )[0];

  const onField = within(preModerationContainer).getByLabelText("On");
  const form = findParentWithType(preModerationContainer, "form")!;

  // Let's enable it.
  act(() => onField.props.onChange(onField.props.value.toString()));
  // Send form
  act(() => {
    form.props.onSubmit();
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(onField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(onField.props.disabled).toBe(false);
    });
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
  const { moderationContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const preModerationContainer = within(moderationContainer).getAllByText(
    "Pre-moderate comments containing links sitewide",
    { selector: "fieldset" }
  )[0];

  const onField = within(preModerationContainer).getByLabelText("On");
  const form = findParentWithType(preModerationContainer, "form")!;

  // Let's enable it.
  act(() => onField.props.onChange(onField.props.value.toString()));

  // Send form
  act(() => {
    form.props.onSubmit();
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(onField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(onField.props.disabled).toBe(false);
    });
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
  const { moderationContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const akismetContainer = within(moderationContainer).getByTestID(
    "akismet-config"
  );

  const onField = within(akismetContainer).getByLabelText("On");
  const keyField = within(akismetContainer).getByLabelText("API key");
  const siteField = within(akismetContainer).getByLabelText("Site URL");
  const form = findParentWithType(akismetContainer, "form")!;

  // Let's turn it on.
  act(() => onField.props.onChange(onField.props.value.toString()));

  expect(saveChangesButton.props.disabled).toBe(false);

  // Send form
  act(() => {
    form.props.onSubmit();
  });

  expect(
    within(akismetContainer).queryAllByText("This field is required.").length
  ).toBe(2);

  // Input valid api key
  act(() => keyField.props.onChange("my api key"));

  // Input correct site.
  act(() => siteField.props.onChange("https://coralproject.net"));

  expect(within(akismetContainer).queryAllByText("Invalid URL").length).toBe(0);

  // Send form
  act(() => {
    form.props.onSubmit();
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(onField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(onField.props.disabled).toBe(false);
    });
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
                sendFeedback: false,
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
  const { moderationContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const perspectiveContainer = within(moderationContainer).getByTestID(
    "perspective-container"
  );

  const onField = within(perspectiveContainer).getByLabelText("On");
  const allowField = within(perspectiveContainer).getByTestID(
    "test-allowStoreCommentData"
  );
  const keyField = within(perspectiveContainer).getByLabelText("API key");
  const thresholdField = within(perspectiveContainer).getByLabelText(
    "Toxicity threshold"
  );
  const endpointField = within(perspectiveContainer).getByLabelText(
    "Custom endpoint"
  );
  const form = findParentWithType(perspectiveContainer, "form")!;

  // Let's turn it on.
  act(() => onField.props.onChange(onField.props.value.toString()));
  act(() => allowField.props.onChange(allowField.props.value.toString()));

  expect(saveChangesButton.props.disabled).toBe(false);

  // Send form
  act(() => {
    form.props.onSubmit();
  });

  expect(
    within(perspectiveContainer).queryAllByText("This field is required.")
      .length
  ).toBe(1);

  // Input valid api key
  act(() => keyField.props.onChange("my api key"));

  // Input malformed endpoint.
  act(() => endpointField.props.onChange("malformed url"));

  // Input malformed threshold.
  act(() => thresholdField.props.onChange("abc"));

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
  act(() => endpointField.props.onChange("https://custom-endpoint.net"));

  // Input valid threshold.
  act(() => thresholdField.props.onChange(10));

  expect(
    within(perspectiveContainer).queryAllByText("Invalid URL").length
  ).toBe(0);

  // Send form
  act(() => {
    form.props.onSubmit();
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(onField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(onField.props.disabled).toBe(false);
    });
  });

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.calledOnce).toBe(true);

  // Use default threshold.
  act(() => thresholdField.props.onChange(""));

  // Send form
  act(() => {
    form.props.onSubmit();
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(onField.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(onField.props.disabled).toBe(false);
    });
  });

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.calledTwice).toBe(true);
});

it("change perspective send feedback setting", async () => {
  const settingsOverride = settings;
  settingsOverride.integrations.perspective = {
    doNotStore: false,
    enabled: true,
    endpoint: "https://custom-endpoint.net",
    key: "api key",
    model: "TOXIC_MODEL",
    threshold: 0.1,
    sendFeedback: false,
  };

  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.integrations!.perspective).toEqual({
          doNotStore: false,
          enabled: true,
          endpoint: "https://custom-endpoint.net",
          key: "api key",
          model: "TOXIC_MODEL",
          threshold: 0.1,
          sendFeedback: true,
        });

        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const { moderationContainer, saveChangesButton } = await createTestRenderer(
    {
      resolvers,
    },
    settingsOverride
  );

  const perspectiveContainer = within(moderationContainer).getByTestID(
    "perspective-container"
  );
  const onField = within(perspectiveContainer).getByLabelText("On");
  const allowField = within(perspectiveContainer).getByTestID(
    "test-allowSendFeedback"
  );
  const form = findParentWithType(perspectiveContainer, "form")!;

  // Let's turn it on.
  act(() => allowField.props.onChange(allowField.props.value.toString()));
  expect(saveChangesButton.props.disabled).toBe(false);

  // Send form
  act(() => {
    form.props.onSubmit();
  });

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(onField.props.disabled).toBe(false);
    });
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.calledOnce).toBe(true);
});
