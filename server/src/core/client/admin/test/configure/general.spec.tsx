import { act, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SinonStub } from "sinon";

import { ERROR_CODES } from "coral-common/errors";
import { pureMerge } from "coral-common/utils";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
import { settings, users } from "../fixtures";

beforeEach(() => {
  replaceHistoryLocation("http://localhost/admin/configure/general");
});

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = createContext({
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
  await act(async () => {
    customRenderAppWithContext(context);
  });
  const generalContainer = await screen.findByTestId(
    "configure-generalContainer"
  );
  const saveChangesButton = screen.getByRole("button", {
    name: "Save Changes",
  });
  return {
    context,
    generalContainer,
    saveChangesButton,
  };
}

it("renders configure general with correct navigation", async () => {
  await createTestRenderer();
  const generalLink = screen.getByRole("link", { name: "General" });
  expect(generalLink).toBeVisible();
  expect(generalLink).toHaveProperty(
    "href",
    "http://localhost/admin/configure/general"
  );

  const organizationLink = screen.getByRole("link", { name: "Organization" });
  expect(organizationLink).toBeVisible();
  expect(organizationLink).toHaveProperty(
    "href",
    "http://localhost/admin/configure/organization"
  );

  const moderationLink = screen.getByRole("link", { name: "Moderation" });
  expect(moderationLink).toBeVisible();
  expect(moderationLink).toHaveProperty(
    "href",
    "http://localhost/admin/configure/moderation"
  );

  const commentsLink = screen.getByRole("button", { name: "Comments" });
  expect(commentsLink).toBeVisible();

  const usersLink = screen.getByRole("button", { name: "Users" });
  expect(usersLink).toBeVisible();

  const moderationPhasesLink = screen.getByRole("link", {
    name: "Moderation Phases",
  });
  expect(moderationPhasesLink).toBeVisible();
  expect(moderationPhasesLink).toHaveProperty(
    "href",
    "http://localhost/admin/configure/moderation/phases"
  );

  const wordListLink = screen.getByRole("link", {
    name: "Banned and Suspect Words",
  });
  expect(wordListLink).toBeVisible();
  expect(wordListLink).toHaveProperty(
    "href",
    "http://localhost/admin/configure/wordList"
  );

  const authLink = screen.getByRole("link", {
    name: "Authentication",
  });
  expect(authLink).toBeVisible();
  expect(authLink).toHaveProperty(
    "href",
    "http://localhost/admin/configure/auth"
  );

  const emailLink = screen.getByRole("link", {
    name: "Email",
  });
  expect(emailLink).toBeVisible();
  expect(emailLink).toHaveProperty(
    "href",
    "http://localhost/admin/configure/email"
  );

  const slackLink = screen.getByRole("link", {
    name: "Slack",
  });
  expect(slackLink).toBeVisible();
  expect(slackLink).toHaveProperty(
    "href",
    "http://localhost/admin/configure/slack"
  );

  const webhooksLink = screen.getByRole("link", {
    name: "Webhooks",
  });
  expect(webhooksLink).toBeVisible();
  expect(webhooksLink).toHaveProperty(
    "href",
    "http://localhost/admin/configure/webhooks"
  );

  const advancedLink = screen.getByRole("link", {
    name: "Advanced",
  });
  expect(advancedLink).toBeVisible();
  expect(advancedLink).toHaveProperty(
    "href",
    "http://localhost/admin/configure/advanced"
  );
});

it("change language", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.locale).toEqual("es");
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const {
    context: { changeLocale },
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({ resolvers });

  const languageField = within(generalContainer).getByLabelText("Language");

  // Let's change the language.
  userEvent.selectOptions(languageField, "es");

  // Send form
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
  });

  // Wait for client to change language.
  await waitFor(() => {
    expect((changeLocale as SinonStub).called).toBe(true);
  });
});

it("change site wide commenting", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.disableCommenting).toEqual({
          enabled: true,
          message: "Closing message",
        });
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const { saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const offField = screen.getByRole("radio", {
    name: "Off - Comment streams closed for new comments",
  });
  const contentField = screen.getByRole("textbox", {
    name: "Sitewide closed comments message",
  });

  // Let's enable it.
  userEvent.click(offField);

  // Let's change the content.
  userEvent.clear(contentField);
  userEvent.type(contentField, "Closing message");

  // Send form
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(offField).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(offField).toBeEnabled();
  });

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("change community guidlines", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.communityGuidelines!.content).toEqual(
          "This is the community guidelines summary"
        );
        expectAndFail(variables.settings.communityGuidelines!.enabled).toEqual(
          true
        );
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });

  const { saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const onField = screen.getByTestId("community-guidelines-on");
  const contentField = screen.getByRole("textbox", {
    name: "Community guidelines summary",
  });

  // Let's enable it.
  userEvent.click(onField);

  // Let's change the content.
  userEvent.clear(contentField);
  userEvent.type(contentField, "This is the community guidelines summary");

  // Send form
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(onField).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(onField).toBeEnabled();
  });

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("change closed stream message", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.closeCommenting!.message).toEqual(
          "The stream has been closed"
        );
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const { saveChangesButton } = await createTestRenderer({ resolvers });

  const contentField = screen.getByRole("textbox", {
    name: "Closed comment stream message",
  });

  // Let's change the content.
  userEvent.clear(contentField);
  userEvent.type(contentField, "The stream has been closed");

  // Send form
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
  });
});

it("change comment editing time", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.editCommentWindowLength).toEqual(
          108000
        );
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const { saveChangesButton } = await createTestRenderer({ resolvers });
  const durationFieldset = screen.getByRole("group", {
    name: "Comment edit timeframe",
  });
  const valueField = within(durationFieldset).getByRole("textbox", {
    name: "value",
  });
  const unitField = within(durationFieldset).getByLabelText("unit");

  // Let's turn on and set some invalid values.
  userEvent.clear(valueField);

  // Send form
  userEvent.click(saveChangesButton);

  expect(screen.queryAllByText("This field is required.").length).toBe(1);

  // Let's change to sth valid.
  userEvent.clear(valueField);
  userEvent.type(valueField, "30");
  userEvent.selectOptions(unitField, "Hours");

  expect(
    screen.queryAllByText(
      "Please enter a whole number greater than or equal to 0"
    ).length
  ).toBe(0);

  // Send form
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
  });
});

it("change comment length limitations", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.charCount).toEqual({
          enabled: true,
          min: null,
          max: 3000,
        });
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const { generalContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
  });
  const onField = screen.getByTestId("comment-length-limit-on");
  const minField = screen.getByRole("textbox", {
    name: "Minimum comment length",
  });
  const maxField = screen.getByRole("textbox", {
    name: "Maximum comment length",
  });

  // Let's turn on and set some invalid values.
  userEvent.click(onField);
  userEvent.clear(minField);
  userEvent.type(minField, "invalid");
  userEvent.clear(maxField);
  userEvent.type(maxField, "-1");

  // Send form
  userEvent.click(saveChangesButton);

  expect(
    within(generalContainer).queryAllByText(
      "Please enter a whole number greater than 0"
    ).length
  ).toBe(2);

  // Make max smaller than min.
  userEvent.clear(minField);
  userEvent.type(minField, "1000");
  userEvent.clear(maxField);
  userEvent.type(maxField, "500");

  expect(
    within(generalContainer).queryAllByText(
      "Please enter a number longer than the minimum length"
    ).length
  ).toBe(1);

  // Let's change to sth valid.
  userEvent.clear(minField);
  userEvent.clear(maxField);
  userEvent.type(maxField, "3000");

  expect(
    within(generalContainer).queryAllByText(
      "Please enter a valid whole number >= 0"
    ).length
  ).toBe(0);

  // Send form
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(minField).toBeDisabled();
  expect(maxField).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(minField).toBeEnabled();
    expect(maxField).toBeEnabled();
  });
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("change closing comment streams", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.closeCommenting!.auto).toEqual(true);
        expectAndFail(variables.settings.closeCommenting!.timeout).toEqual(
          2592000
        );
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const { generalContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const onField = screen.getByTestId("close-commenting-streams-on");
  const durationFieldset = screen.getByRole("group", {
    name: "Close comments after",
  });
  const valueField = within(durationFieldset).getByRole("textbox", {
    name: "value",
  });
  const unitField = within(durationFieldset).getByLabelText("unit");

  // Let's turn on and set some invalid values.
  userEvent.click(onField);
  userEvent.clear(valueField);

  // Send form
  userEvent.click(saveChangesButton);

  expect(
    within(generalContainer).queryAllByText("This field is required.").length
  ).toBe(1);

  // Let's change to sth valid.
  userEvent.clear(valueField);
  userEvent.type(valueField, "30");
  userEvent.selectOptions(unitField, "Days");

  // Send form
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(valueField).toBeDisabled();
  expect(unitField).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(valueField).toBeEnabled();
    expect(unitField).toBeEnabled();
  });
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("handle server error", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: () => {
        throw new InvalidRequestError({
          code: ERROR_CODES.INTERNAL_ERROR,
          traceID: "traceID",
        });
      },
    },
  });

  const { generalContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
    muteNetworkErrors: true,
  });

  const contentField = within(generalContainer).getByRole("textbox", {
    name: "Closed comment stream message",
  });

  // Let's change the content.
  userEvent.clear(contentField);
  userEvent.type(contentField, "The stream has been closed");

  // Send form
  userEvent.click(saveChangesButton);

  // Look for internal error being displayed.
  expect(await screen.findByText("INTERNAL_ERROR")).toBeDefined();
});

it("change rte config", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.rte).toEqual({
          enabled: true,
          strikethrough: true,
          spoiler: false,
        });
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const { saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const onField = screen.getByRole("radio", {
    name: "On - bold, italics, block quotes, and bulleted lists",
  });
  const offField = screen.getByTestId("rte-config-offField");
  const strikethroughField = screen.getByLabelText("Strikethrough");

  // Turn off rte will disable additional options.
  userEvent.click(offField);
  expect(strikethroughField).toBeDisabled();

  // Turn on rte will enable additional options.
  userEvent.click(onField);
  expect(strikethroughField).toBeEnabled();

  // Enable strikethrough option.
  userEvent.click(strikethroughField);

  // Send form
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(onField).toBeDisabled();
  expect(strikethroughField).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(onField).toBeEnabled();
    expect(strikethroughField).toBeEnabled();
  });
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});
