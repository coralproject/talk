import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import sinon from "sinon";

import { pureMerge } from "coral-common/utils";
import {
  GQLFEATURE_FLAG,
  GQLMODERATION_MODE,
  GQLResolver,
} from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
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
  const { context } = createContext({
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
  customRenderAppWithContext(context);
  const moderationContainer = await screen.findByTestId(
    "configure-moderationContainer"
  );
  const saveChangesButton = screen.getByRole("button", {
    name: "Save Changes",
  });
  return {
    context,
    moderationContainer,
    saveChangesButton,
  };
}

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

  const preModerationContainer = within(moderationContainer).getAllByRole(
    "group",
    { name: "Pre-moderate all comments" }
  )[0];

  // Let's enable it and submit.
  const onField = within(preModerationContainer).getByLabelText("On");
  userEvent.click(onField);
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(onField).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(onField).not.toBeDisabled();
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
  const preModerationContainer = within(moderationContainer).getAllByRole(
    "group",
    { name: "Pre-moderate all comments" }
  )[0];

  // Let's enable it.
  const onField = within(preModerationContainer).getByLabelText(
    "Specific sites"
  );
  userEvent.click(onField);

  // Search by site name and select Test Site
  const siteSearchField = within(preModerationContainer).getByRole("textbox", {
    name: "Search by site name",
  });
  userEvent.type(siteSearchField, "Test");
  const siteSearchButton = within(preModerationContainer).getByRole("button", {
    name: "Search",
  });
  userEvent.click(siteSearchButton);
  await screen.findByTestId("site-search-list");
  const testSite = within(preModerationContainer).getByText("Test Site");
  userEvent.click(testSite);

  // Save changes
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(onField).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(onField).not.toBeDisabled();
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
  const preModerationContainer = within(moderationContainer).getAllByRole(
    "group",
    {
      name: "Pre-moderate all comments containing links",
    }
  )[0];

  // Let's enable it.
  const onField = within(preModerationContainer).getByLabelText("On");
  userEvent.click(onField);

  // Save changes
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(onField).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(onField).not.toBeDisabled();
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

  const akismetContainer =
    within(moderationContainer).getByTestId("akismet-config");
  const spamDetectionFieldset = within(moderationContainer).getAllByRole(
    "group",
    {
      name: "Spam detection filter",
    }
  )[0];

  const onField = within(spamDetectionFieldset).getByLabelText("On");
  const keyField = within(akismetContainer).getByLabelText("API key");
  const siteField = within(akismetContainer).getByLabelText("Site URL");

  // Let's turn it on.
  userEvent.click(onField);

  expect(saveChangesButton).not.toBeDisabled();

  userEvent.click(saveChangesButton);
  expect(
    within(akismetContainer).queryAllByText("This field is required.").length
  ).toBe(2);

  // Input valid api key
  userEvent.type(keyField, "my api key");

  // Input correct site.
  userEvent.type(siteField, "https://coralproject.net");

  expect(within(akismetContainer).queryAllByText("Invalid URL").length).toBe(0);

  // Submit the form
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(onField).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(onField).not.toBeDisabled();
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

  const enableNewCommenterApproval = within(moderationContainer).getAllByRole(
    "group",
    {
      name: "Enable new commenter approval",
    }
  )[0];

  // Change pre-moderation to on for all new commenters
  const allSitesOption = within(enableNewCommenterApproval).getByLabelText(
    "All sites"
  );
  userEvent.click(allSitesOption);

  // Submit changes
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(allSitesOption).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(allSitesOption).not.toBeDisabled();
  });

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);

  // Change pre-moderation to specific sites for
  const specificSitesOption = within(enableNewCommenterApproval).getByRole(
    "radio",
    { name: "Specific sites" }
  );
  userEvent.click(specificSitesOption);

  // Send form
  userEvent.click(saveChangesButton);

  // see validation error with no site selected
  expect(
    within(enableNewCommenterApproval).getByText(
      "You must select at least one site."
    )
  ).toBeDefined();

  const siteSearchField = within(enableNewCommenterApproval).getByRole(
    "textbox",
    {
      name: "Search by site name",
    }
  );
  userEvent.type(siteSearchField, "Test");
  const siteSearchButton = within(enableNewCommenterApproval).getByRole(
    "button",
    {
      name: "Search",
    }
  );
  userEvent.click(siteSearchButton);

  // Add site on which to premoderate all comments
  await screen.findByTestId("site-search-list");
  const testSite = within(enableNewCommenterApproval).getByText("Test Site");
  userEvent.click(testSite);

  // Send form
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(specificSitesOption).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(specificSitesOption).not.toBeDisabled();
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

  const enableNewCommenterApproval = within(moderationContainer).getAllByRole(
    "group",
    {
      name: "Enable new commenter approval",
    }
  )[0];

  // Change pre-moderation to on for all new commenters
  const onOption = within(enableNewCommenterApproval).getByLabelText("On");
  userEvent.click(onOption);

  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(onOption).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(onOption).not.toBeDisabled();
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

  const perspectiveContainer = within(moderationContainer).getByTestId(
    "perspective-container"
  );

  const onField = within(perspectiveContainer).getByLabelText("On");
  const dontAllowField = within(perspectiveContainer).getAllByRole("radio", {
    name: "Don't allow",
  })[0];
  const allowField = within(perspectiveContainer).getAllByRole("radio", {
    name: "Allow",
  })[0];
  const keyField = within(perspectiveContainer).getByLabelText("API key");
  const thresholdField =
    within(perspectiveContainer).getByLabelText("Toxicity threshold");
  const endpointField =
    within(perspectiveContainer).getByLabelText("Custom endpoint");

  // Let's turn it on.
  userEvent.click(onField);
  userEvent.click(dontAllowField);
  userEvent.click(allowField);

  expect(saveChangesButton).not.toBeDisabled();

  // Send form
  userEvent.click(saveChangesButton);

  expect(
    within(perspectiveContainer).queryAllByText("This field is required.")
      .length
  ).toBe(1);

  // Input valid api key
  userEvent.type(keyField, "my api key");

  // Input malformed endpoint.
  userEvent.type(endpointField, "malformed url");

  // Input malformed threshold.
  userEvent.type(thresholdField, "abc");

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
  userEvent.clear(endpointField);
  userEvent.type(endpointField, "https://custom-endpoint.net");

  // Input valid threshold.
  userEvent.clear(thresholdField);
  userEvent.type(thresholdField, "10");

  expect(
    within(perspectiveContainer).queryAllByText("Invalid URL").length
  ).toBe(0);
  expect(
    within(perspectiveContainer).queryAllByText(
      "Please enter a whole number between 0 and 100."
    ).length
  ).toBe(0);

  // Send form
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(onField).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(onField).not.toBeDisabled();
  });

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.calledOnce).toBe(true);

  // Use default threshold.
  userEvent.clear(thresholdField);

  // Send form
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(onField).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(onField).not.toBeDisabled();
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

  const perspectiveContainer = within(moderationContainer).getByTestId(
    "perspective-container"
  );
  const onField = within(perspectiveContainer).getByLabelText("On");
  const allowField = within(perspectiveContainer).getByTestId(
    "test-allowSendFeedback"
  );

  // Let's turn it on.
  userEvent.click(allowField);
  expect(saveChangesButton).not.toBeDisabled();

  // Send form
  userEvent.click(saveChangesButton);

  // Wait for submission to be finished
  await waitFor(() => {
    expect(onField).not.toBeDisabled();
  });

  // Submit button should be disabled.
  expect(saveChangesButton).toBeDisabled();

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.calledOnce).toBe(true);
});

it("navigates to correct route for adding email domains", async () => {
  const { context } = await createTestRenderer();

  // Prevent router transitions.
  context.transitionControl.allowTransition = false;

  const moderationContainer = await screen.findByTestId(
    "configure-moderationContainer"
  );
  const emailDomainConfig = within(moderationContainer).getByTestId(
    "emailDomain-container"
  );

  expect(
    within(emailDomainConfig).queryByTestId(
      "configuration-moderation-emailDomains-table"
    )
  ).toBeNull();

  const addDomainButton = within(emailDomainConfig).getByRole("link", {
    name: "Add domain",
  });
  userEvent.click(addDomainButton);

  // Expect a routing request was made to the right url.
  await waitFor(() => {
    expect(context.transitionControl.history[0].pathname).toBe(
      "/admin/configure/moderation/domains/add"
    );
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

  const emailDomainConfig = within(moderationContainer).getByTestId(
    "emailDomain-container"
  );
  const deleteDomainButton = within(emailDomainConfig).getByTestId(
    "domain-delete-1a60424a-c116-483a-b315-837a7fd5b496"
  );
  userEvent.click(deleteDomainButton);

  await waitFor(() => {
    expect(resolvers.Mutation!.deleteEmailDomain!.called).toBe(true);
  });

  window.confirm = origConfirm;
});

it("change external links for moderators", async () => {
  const settingsOverride = settings;
  settingsOverride.featureFlags = [
    GQLFEATURE_FLAG.CONFIGURE_PUBLIC_PROFILE_URL,
  ];
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.externalProfileURL).toEqual(
          "https://example.com/users/$USER_NAME"
        );
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

  const externalProfileURLPatternField = within(
    moderationContainer
  ).getByLabelText("External profile URL pattern");
  userEvent.type(
    externalProfileURLPatternField,
    "https://example.com/random/invalid-url"
  );

  userEvent.click(saveChangesButton);

  // See validation error with invalid url format
  expect(
    within(moderationContainer).queryAllByText(
      "All external profile URL patterns must contain either $USER_NAME or $USER_ID."
    ).length
  ).toBe(1);

  userEvent.clear(externalProfileURLPatternField);
  userEvent.type(
    externalProfileURLPatternField,
    "https://example.com/users/$USER_NAME"
  );
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(externalProfileURLPatternField).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(externalProfileURLPatternField).not.toBeDisabled();
  });

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});
