import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { pureMerge } from "coral-common/common/lib/utils";
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
  replaceHistoryLocation("http://localhost/admin/configure/advanced");
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
  const advancedContainer = screen.getByTestId("configure-advancedContainer");
  const saveChangesButton = screen.getByRole("button", {
    name: "Save Changes",
  });

  return {
    context,
    configureContainer,
    advancedContainer,
    saveChangesButton,
  };
}

it("renders configure advanced", async () => {
  const { configureContainer } = await createTestRenderer();
  expect(within(configureContainer).getByLabelText("Custom CSS")).toBeDefined();
  expect(
    within(configureContainer).getByText("Embedded comments")
  ).toBeDefined();
  expect(
    within(configureContainer).getByText("Comment stream live updates")
  ).toBeDefined();
  expect(within(configureContainer).getByText("Story creation")).toBeDefined();
  expect(
    within(configureContainer).getByText("Accelerated Mobile Pages")
  ).toBeDefined();
  expect(
    within(configureContainer).getByText("Review all user reports")
  ).toBeDefined();
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
  const { advancedContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const customCSSField = within(advancedContainer).getByLabelText("Custom CSS");

  // Let's change the customCSS field.
  userEvent.type(customCSSField, "./custom.css");

  // Send form
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();
  expect(customCSSField).toBeDisabled();

  // // Wait for submission to be finished
  await waitFor(() => {
    expect(customCSSField).not.toBeDisabled();
  });

  // Should have successfully sent with server.
  expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
});

it("remove custom css", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      settings: () =>
        pureMerge<typeof settings>(settings, {
          customCSSURL: "./custom.css",
        }),
    },
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.customCSSURL).toBeNull();
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const { saveChangesButton, advancedContainer } = await createTestRenderer({
    resolvers,
  });

  const customCSSField = within(advancedContainer).getByLabelText("Custom CSS");

  // Let's change the customCSS field.
  userEvent.clear(customCSSField);
  userEvent.type(customCSSField, "");

  // Send form
  userEvent.click(saveChangesButton);

  // Wait for submission to be finished
  await waitFor(() => {
    expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
  });
});

it("renders with live configuration when configurable", async () => {
  const { advancedContainer } = await createTestRenderer();

  expect(
    within(advancedContainer).queryByLabelText("Comment Stream Live Updates")
  ).toBeDefined();
});

it("renders without live configuration when not configurable", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      settings: () =>
        pureMerge<typeof settings>(settings, {
          live: { configurable: false },
        }),
    },
  });
  const { advancedContainer } = await createTestRenderer({
    resolvers,
  });

  expect(
    within(advancedContainer).queryByLabelText("Comment Stream Live Updates")
  ).toEqual(null);
});

it("change review all user reports to enable For review queue", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      settings: () => settings,
    },
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(variables.settings.forReviewQueue).toEqual(true);
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const { advancedContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const forReviewQueueBox = within(advancedContainer).getByTestId(
    "for-review-queue-config-box"
  );

  const onField = within(forReviewQueueBox).getByLabelText("On");
  userEvent.click(onField);

  // Send form
  userEvent.click(saveChangesButton);

  // Wait for submission to be finished
  await waitFor(() => {
    expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
  });
});

it("change embedded comments allow replies", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(
          variables.settings.embeddedComments?.allowReplies
        ).toEqual(false);
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const { advancedContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const embeddedCommentReplies = within(advancedContainer).getByTestId(
    "embedded-comments-config"
  );

  const offField = within(embeddedCommentReplies).getByText("Off");

  userEvent.click(offField);

  // Send form
  userEvent.click(saveChangesButton);

  // Submit button and text field should be disabled.
  expect(saveChangesButton).toBeDisabled();

  // Should have successfully sent with server.
  await waitFor(() => {
    expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
  });
});

it("change oembed permitted domains", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateSettings: ({ variables }) => {
        expectAndFail(
          variables.settings.embeddedComments?.oEmbedAllowedOrigins
        ).toEqual(["http://localhost:8080"]);
        return {
          settings: pureMerge(settings, variables.settings),
        };
      },
    },
  });
  const { advancedContainer, saveChangesButton } = await createTestRenderer({
    resolvers,
  });

  const oembedAllowedOriginsConfig = within(advancedContainer).getByTestId(
    "embedded-comments-config"
  );

  const allowedOriginsTextArea = within(oembedAllowedOriginsConfig).getByRole(
    "textbox"
  );

  userEvent.type(allowedOriginsTextArea, "http://");

  userEvent.click(saveChangesButton);

  expect(within(advancedContainer).getByText("Invalid URL"));

  userEvent.type(allowedOriginsTextArea, "localhost:8080");

  userEvent.click(saveChangesButton);

  await waitFor(() => {
    expect(resolvers.Mutation!.updateSettings!.called).toBe(true);
  });
});
