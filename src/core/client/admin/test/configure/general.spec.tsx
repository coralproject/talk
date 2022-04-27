import { SinonStub } from "sinon";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
  customRenderAppWithContext(context);
  const configureContainer = await screen.findByTestId("configure-container");
  const generalContainer = screen.getByTestId("configure-generalContainer");
  const saveChangesButton = screen.getByRole("button", {
    name: "Save Changes",
  });
  return {
    context,
    configureContainer,
    generalContainer,
    saveChangesButton,
  };
}

it("renders configure general with expected configuration sections", async () => {
  await createTestRenderer();
  expect(screen.getByLabelText("Language")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Flatten replies" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Load everything" })
  ).toBeInTheDocument();
  expect(screen.getByText("Sitewide commenting")).toBeInTheDocument();
  expect(screen.getByText("Community announcement")).toBeInTheDocument();
  expect(
    screen.getByLabelText("Community guidelines summary")
  ).toBeInTheDocument();
  expect(screen.getByText("Comment length")).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Comment editing" })
  ).toBeInTheDocument();
  expect(screen.getByText("Closing comment streams")).toBeInTheDocument();
  expect(screen.getByText("Closed comment stream message")).toBeInTheDocument();
  expect(screen.getByText("Member badges")).toBeInTheDocument();
  expect(screen.getByText("Commenter bios")).toBeInTheDocument();
  expect(screen.getByText("Embedded media")).toBeInTheDocument();
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
  userEvent.click(saveChangesButton);

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
  const { generalContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const offField = within(generalContainer).getByRole("radio", {
    name: "Off - Comment streams closed for new comments",
  });
  const contentField = within(generalContainer).getByRole("textbox", {
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
    expect(offField).not.toBeDisabled();
  });

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("change community guidelines", async () => {
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

  const { generalContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const onField = within(generalContainer).getByTestId(
    "community-guidelines-on"
  );
  const contentField = within(generalContainer).getByRole("textbox", {
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
    expect(onField).not.toBeDisabled();
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
  const { generalContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const contentField = within(generalContainer).getByLabelText(
    "Closed comment stream message"
  );

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
  const { generalContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const commentEditingConfigBox = within(generalContainer).getByTestId(
    "comment-editing-config-box"
  );
  const valueField = within(commentEditingConfigBox).getByLabelText("value");
  const unitField = within(commentEditingConfigBox).getByLabelText("unit");

  // Let's turn on and set some invalid values.
  userEvent.clear(valueField);

  // Send form
  userEvent.click(saveChangesButton);

  expect(
    within(generalContainer).queryAllByText("This field is required.").length
  ).toBe(1);

  // Let's change to sth valid.
  userEvent.clear(valueField);
  userEvent.type(valueField, "30");
  userEvent.selectOptions(unitField, "Hours");

  expect(
    within(generalContainer).queryAllByText(
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

  const commentLengthContainer = within(generalContainer).getByTestId(
    "comment-length-config-box"
  );
  const onField = within(commentLengthContainer).getByLabelText("On");
  const minField = within(commentLengthContainer).getByLabelText(
    "Minimum comment length"
  );
  const maxField = within(commentLengthContainer).getByLabelText(
    "Maximum comment length"
  );

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
    expect(minField).not.toBeDisabled();
    expect(maxField).not.toBeDisabled();
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

  const closingCommentStreamsContainer = within(generalContainer).getByTestId(
    "closing-comment-streams-config-box"
  );
  const onField = within(closingCommentStreamsContainer).getByLabelText("On");
  const valueField = within(closingCommentStreamsContainer).getByLabelText(
    "value"
  );
  const unitField = within(closingCommentStreamsContainer).getByLabelText(
    "unit"
  );

  // Let's turn on and set some invalid values.
  userEvent.click(onField);
  userEvent.clear(valueField);

  // Send form
  userEvent.click(saveChangesButton);

  expect(
    within(generalContainer).queryAllByText("This field is required.").length
  ).toBe(1);

  // Let's change to sth valid.
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
    expect(valueField).not.toBeDisabled();
    expect(unitField).not.toBeDisabled();
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

  const {
    configureContainer,
    generalContainer,
    saveChangesButton,
  } = await createTestRenderer({
    resolvers,
    muteNetworkErrors: true,
  });

  const contentField = within(generalContainer).getByLabelText(
    "Closed comment stream message"
  );

  // Let's change the content.
  userEvent.clear(contentField);
  userEvent.type(contentField, "The stream has been closed");

  // Send form
  userEvent.click(saveChangesButton);

  // Look for internal error being displayed.
  expect(
    await within(configureContainer).findByText("INTERNAL_ERROR")
  ).toBeVisible();
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
  const { generalContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const rteContainer = within(generalContainer).getByTestId("rte-config-box");
  const onField = within(rteContainer).getByLabelText(
    "On - bold, italics, block quotes, and bulleted lists"
  );
  const offField = within(rteContainer).getByLabelText("Off");
  const strikethroughField = within(rteContainer).getByLabelText(
    "Strikethrough"
  );

  // Turn off rte will disable additional options.
  userEvent.click(offField);
  expect(strikethroughField).toBeDisabled();

  // Turn on rte will enable additional options.
  userEvent.click(onField);
  expect(strikethroughField).not.toBeDisabled();

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
    expect(onField).not.toBeDisabled();
    expect(strikethroughField).not.toBeDisabled();
  });
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});
