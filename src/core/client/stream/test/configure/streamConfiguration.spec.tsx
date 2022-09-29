import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { pureMerge } from "coral-common/utils";
import {
  GQLResolver,
  MutationToUpdateStorySettingsResolver,
} from "coral-framework/schema";
import {
  createMutationResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import customRenderAppWithContext from "../customRenderAppWithContext";
import { moderators, settings, stories } from "../fixtures";
import { createContext } from "./create";

const viewer = moderators[0];
const story = stories[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/community");
});

const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {}
) => {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          story: ({ variables }) => {
            expectAndFail(variables).toEqual({ id: story.id, url: null });
            return story;
          },
          viewer: () => viewer,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(story.id, "storyID");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });

  customRenderAppWithContext(context);

  let tabPane: HTMLElement | undefined;
  await waitFor(async () => {
    tabPane = await screen.findByRole("region", { name: "Tab:" });
  });
  const applyButton = await screen.findByTestId("configure-stream-apply");
  const form = screen.getByRole("region", {
    name: "Configure this stream",
  });
  return { tabPane, applyButton, form };
};

it("change premod", async () => {
  const updateStorySettingsStub =
    createMutationResolverStub<MutationToUpdateStorySettingsResolver>(
      ({ variables }) => {
        expectAndFail(variables.settings.moderation).toEqual("PRE");
        return {
          story: pureMerge(story, { settings: variables.settings }),
        };
      }
    );

  const { form, applyButton } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        updateStorySettings: updateStorySettingsStub,
      },
    }),
  });

  const premodField = within(form).getByLabelText("Pre-moderate all comments");
  expect(applyButton).toBeDisabled();

  // Let's enable premod.
  userEvent.click(premodField);
  await waitFor(() => {
    expect(applyButton).toBeEnabled();
  });

  userEvent.click(applyButton);

  // Send form
  expect(applyButton).toBeDisabled();
  expect(premodField).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(premodField).toBeEnabled();
  });

  // Should have successfully sent with server.
  expect(updateStorySettingsStub.called).toBe(true);
});

it("change premod links", async () => {
  const updateStorySettingsStub =
    createMutationResolverStub<MutationToUpdateStorySettingsResolver>(
      ({ variables }) => {
        expectAndFail(variables.settings.premodLinksEnable).toEqual(true);
        return {
          story: pureMerge(story, { settings: variables.settings }),
        };
      }
    );
  const { form, applyButton } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        updateStorySettings: updateStorySettingsStub,
      },
    }),
  });

  const premodLinksField = within(form).getByLabelText(
    "Pre-moderate comments containing links"
  );

  expect(applyButton).toBeDisabled();
  // Let's enable premod.
  userEvent.click(premodLinksField);
  await waitFor(() => {
    expect(applyButton).toBeEnabled();
  });

  userEvent.click(applyButton);
  expect(applyButton).toBeDisabled();
  expect(premodLinksField).toBeDisabled();

  // Wait for submission to be finished
  await waitFor(() => {
    expect(premodLinksField).toBeEnabled();
  });

  // Should have successfully sent with server.
  expect(updateStorySettingsStub.called).toBe(true);
});

it("change message box", async () => {
  const updateStorySettingsStub =
    createMutationResolverStub<MutationToUpdateStorySettingsResolver>(
      ({ variables }) => {
        expectAndFail(variables.settings.messageBox).toEqual({
          enabled: true,
          content: "*What do you think?*",
          icon: "question_answer",
        });
        return {
          story: pureMerge(story, { settings: variables.settings }),
        };
      }
    );
  const { tabPane } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        updateStorySettings: updateStorySettingsStub,
      },
    }),
  });

  const enableField = within(tabPane!).getByRole("button", {
    name: "Add message",
  });
  userEvent.click(enableField);

  // Select icon
  const conversationRadio = within(tabPane!).getByRole("radio", {
    name: "Conversation",
  });
  userEvent.click(conversationRadio);

  // Change content.
  const messageText = await waitFor(() =>
    within(tabPane!).getByLabelText("Write a message")
  );
  userEvent.clear(messageText);
  userEvent.type(messageText, "*What do you think?*");

  const saveChanges = within(tabPane!).getByRole("button", {
    name: "Add message",
  });
  expect(saveChanges).toBeEnabled();
  userEvent.click(saveChanges);

  // Should have successfully sent with server.
  expect(updateStorySettingsStub.called).toBe(true);
});

it("remove message icon", async () => {
  const updateStorySettingsStub =
    createMutationResolverStub<MutationToUpdateStorySettingsResolver>(
      ({ variables }) => {
        expectAndFail(variables.settings.messageBox).toEqual({
          enabled: true,
          content: "*What do you think?*",
          icon: null,
        });
        return {
          story: pureMerge(story, { settings: variables.settings }),
        };
      }
    );
  const { tabPane } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        story: () =>
          pureMerge<typeof story>(story, {
            settings: {
              messageBox: {
                enabled: true,
                content: "*What do you think?*",
                icon: "question_answer",
              },
            },
          }),
      },
      Mutation: {
        updateStorySettings: updateStorySettingsStub,
      },
    }),
  });

  const noIconRadio = within(tabPane!).getByRole("radio", {
    name: "No icon",
  });
  userEvent.click(noIconRadio);

  // Send form
  const saveChanges = within(tabPane!).getByTestId(
    "configure-addMessage-submitUpdate"
  );
  await waitFor(() => {
    expect(saveChanges).toBeEnabled();
  });
  userEvent.click(saveChanges);

  expect(updateStorySettingsStub.called).toBe(true);
});
