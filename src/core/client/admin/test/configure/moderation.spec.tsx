import { noop } from "lodash";
import sinon from "sinon";

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
import {
  settings,
  settingsWithMultisite,
  siteConnection,
  users,
} from "../fixtures";

beforeEach(() => {
  replaceHistoryLocation("http://localhost/admin/configure/moderation");
});

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {},
  settingsOverride?: any
) {
  const { testRenderer, context } = create({
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
    context,
  };
}

it("renders configure moderation", async () => {
  const { configureContainer } = await createTestRenderer();
  expect(within(configureContainer).toJSON()).toMatchSnapshot();
});

it("change pre-moderation to On for all comments for single-site tenants", async () => {
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
    "Pre-moderate all comments",
    {
      selector: "fieldset",
    }
  )[0];

  const onField = within(preModerationContainer).getByLabelText("On");
  const form = findParentWithType(preModerationContainer, "form")!;

  // Let's enable it.
  act(() => onField.props.onChange(onField.props.value.toString()));
  // Send form
  act(() => {
    form.props.onSubmit({ preventDefault: noop });
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

it("change site wide pre-moderation to Specific sites", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      sites: () => siteConnection,
    },
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.moderation).toEqual(
          GQLMODERATION_MODE.SPECIFIC_SITES_PRE
        );
        expectAndFail(variables.settings.premoderateAllCommentsSites).toEqual([
          "site-1",
        ]);
        return {
          settings: pureMerge(settingsWithMultisite, variables.settings),
        };
      },
    },
  });
  const { moderationContainer, saveChangesButton } = await createTestRenderer(
    {
      resolvers,
    },
    settingsWithMultisite
  );

  const preModerationContainer = within(moderationContainer).getAllByText(
    "Pre-moderate all comments",
    {
      selector: "fieldset",
    }
  )[0];

  const onField = within(preModerationContainer).getByLabelText(
    "Specific sites"
  );

  // Let's enable it.
  act(() => onField.props.onChange(onField.props.value.toString()));

  const siteSearchField = within(preModerationContainer).getByTestID(
    "site-search-textField"
  );

  act(() =>
    siteSearchField.props.onChange({
      target: { value: "Test" },
    })
  );

  const siteSearchButton = within(preModerationContainer).getByTestID(
    "site-search-button"
  );
  act(() => {
    siteSearchButton.props.onClick({ preventDefault: noop });
  });

  // Add site on which to premoderate all comments
  await act(async () => {
    await waitForElement(() =>
      within(preModerationContainer).getByTestID("site-search-list")
    );
    within(preModerationContainer).getByText("Test Site").props.onClick();
  });

  const form = findParentWithType(preModerationContainer, "form")!;

  // Send form
  act(() => {
    form.props.onSubmit({ preventDefault: noop });
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
    "Pre-moderate all comments containing links",
    {
      selector: "fieldset",
    }
  )[0];

  const onField = within(preModerationContainer).getByLabelText("On");
  const form = findParentWithType(preModerationContainer, "form")!;

  // Let's enable it.
  act(() => onField.props.onChange(onField.props.value.toString()));

  // Send form
  act(() => {
    form.props.onSubmit({ preventDefault: noop });
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
          ipBased: false,
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

  const spamDetectionFieldset = within(akismetContainer).getAllByText(
    "Spam detection filter",
    {
      selector: "fieldset",
    }
  )[1];
  const onField = within(spamDetectionFieldset).getByLabelText("On");
  const keyField = within(akismetContainer).getByLabelText("API key");
  const siteField = within(akismetContainer).getByLabelText("Site URL");
  const form = findParentWithType(akismetContainer, "form")!;

  // Let's turn it on.
  act(() => onField.props.onChange(onField.props.value.toString()));

  expect(saveChangesButton.props.disabled).toBe(false);

  // Send form
  act(() => {
    form.props.onSubmit({ preventDefault: noop });
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
    form.props.onSubmit({ preventDefault: noop });
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

it("change new commenter approval settings on multisite tenant", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      sites: () => siteConnection,
    },
    Mutation: {
      updateSettings: ({ variables, callCount }) => {
        switch (callCount) {
          case 0:
            expectAndFail(variables.settings.newCommenters).toEqual({
              approvedCommentsThreshold: 2,
              moderation: {
                mode: "PRE",
                premodSites: [],
              },
              premodEnabled: false,
            });
            break;
          case 1:
            expectAndFail(variables.settings.newCommenters).toEqual({
              approvedCommentsThreshold: 2,
              moderation: {
                mode: "SPECIFIC_SITES_PRE",
                premodSites: ["site-1"],
              },
              premodEnabled: false,
            });
            break;
        }
        return {
          settings: pureMerge(settingsWithMultisite, variables.settings),
        };
      },
    },
  });
  const { moderationContainer, saveChangesButton } = await createTestRenderer(
    {
      resolvers,
    },
    settingsWithMultisite
  );

  const enableNewCommenterApproval = within(
    moderationContainer
  ).getByText("Enable new commenter approval", { selector: "fieldset" });

  // Change pre-moderation to on for all new commenters
  const allSitesOption = within(enableNewCommenterApproval).getByLabelText(
    "All sites"
  );
  act(() =>
    allSitesOption.props.onChange(allSitesOption.props.value.toString())
  );

  const form = findParentWithType(enableNewCommenterApproval, "form")!;

  // Send form
  act(() => {
    form.props.onSubmit({ preventDefault: noop });
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(allSitesOption.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(allSitesOption.props.disabled).toBe(false);
    });
  });

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);

  // Change pre-moderation to specific sites for
  const specificSitesOption = within(enableNewCommenterApproval).getByLabelText(
    "Specific sites"
  );
  act(() =>
    specificSitesOption.props.onChange(
      specificSitesOption.props.value.toString()
    )
  );

  // // Send form
  act(() => {
    form.props.onSubmit({ preventDefault: noop });
  });

  // see validation error with no site selected
  expect(
    within(enableNewCommenterApproval).getByText(
      "You must select at least one site."
    )
  ).toBeDefined();

  const siteSearchField = within(enableNewCommenterApproval).getByTestID(
    "site-search-textField"
  );
  act(() => siteSearchField.props.onChange({ target: { value: "Test" } }));

  const siteSearchButton = within(enableNewCommenterApproval).getByTestID(
    "site-search-button"
  );
  act(() => {
    siteSearchButton.props.onClick({ preventDefault: noop });
  });

  // // Add site on which to premoderate all comments
  await act(async () => {
    await waitForElement(() =>
      within(enableNewCommenterApproval).getByTestID("site-search-list")
    );
    within(enableNewCommenterApproval).getByText("Test Site").props.onClick();
  });

  // Send form
  act(() => {
    form.props.onSubmit({ preventDefault: noop });
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(specificSitesOption.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(specificSitesOption.props.disabled).toBe(false);
    });
  });

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("change new commenter approval settings on single site tenant", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      sites: () => siteConnection,
    },
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.newCommenters).toEqual({
          approvedCommentsThreshold: 2,
          moderation: {
            mode: "PRE",
            premodSites: [],
          },
          premodEnabled: false,
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

  const enableNewCommenterApproval = within(
    moderationContainer
  ).getByText("Enable new commenter approval", { selector: "fieldset" });

  // Change pre-moderation to on for all new commenters
  const onOption = within(enableNewCommenterApproval).getByLabelText("On");
  act(() => onOption.props.onChange(onOption.props.value.toString()));

  const form = findParentWithType(enableNewCommenterApproval, "form")!;

  // Send form
  act(() => {
    form.props.onSubmit({ preventDefault: noop });
  });

  // Submit button and text field should be disabled.
  expect(saveChangesButton.props.disabled).toBe(true);
  expect(onOption.props.disabled).toBe(true);

  // Wait for submission to be finished
  await act(async () => {
    await wait(() => {
      expect(onOption.props.disabled).toBe(false);
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
    form.props.onSubmit({ preventDefault: noop });
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
    form.props.onSubmit({ preventDefault: noop });
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
    form.props.onSubmit({ preventDefault: noop });
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
    form.props.onSubmit({ preventDefault: noop });
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

it("navigates to correct route for adding email domains", async () => {
  const {
    moderationContainer,
    context: { transitionControl },
  } = await createTestRenderer();

  // Prevent router transitions.
  transitionControl.allowTransition = false;

  const emailDomainConfig = within(moderationContainer).getByID("emailDomain");

  expect(
    within(emailDomainConfig).queryByTestID(
      "configuration-moderation-emailDomains-table"
    )
  ).toBeNull();

  const addDomainButton = within(emailDomainConfig).getByText("Add domain");
  act(() => {
    addDomainButton.props.onClick({ button: 0, preventDefault: noop });
  });

  // Expect a routing request was made to the right url.
  await act(async () => {
    await wait(() => {
      expect(transitionControl.history[0].pathname).toBe(
        "/admin/configure/moderation/domains/add"
      );
    });
  });
});

it("deletes email domains from configuration", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      settings: () =>
        pureMerge(settings, {
          emailDomainModeration: [
            {
              id: "1a60424a-c116-483a-b315-837a7fd5b496",
              domain: "email.com",
              newUserModeration: "BAN",
            },
          ],
        }),
    },
    Mutation: {
      deleteEmailDomain: ({ variables }) => {
        expectAndFail(variables.id).toEqual(
          "1a60424a-c116-483a-b315-837a7fd5b496"
        );
        return {
          settings: pureMerge(settings, {
            emailDomainModeration: [],
          }),
        };
      },
    },
  });
  const origConfirm = window.confirm;
  window.confirm = sinon.stub().returns(true);
  const { moderationContainer } = await createTestRenderer({ resolvers });
  const emailDomainConfig = within(moderationContainer).getByID("emailDomain");
  const deleteDomainButton = within(emailDomainConfig).getByTestID(
    "domain-delete-1a60424a-c116-483a-b315-837a7fd5b496"
  );
  await act(async () => deleteDomainButton.props.onClick());

  await act(async () => {
    await wait(() => {
      expect(resolvers.Mutation!.deleteEmailDomain!.called).toBe(true);
    });
  });

  window.confirm = origConfirm;
});
