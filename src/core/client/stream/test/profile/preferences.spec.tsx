import { act, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import sinon from "sinon";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";

import customRenderAppWithContext from "../customRenderAppWithContext";
import { commenters, settings, stories, viewerPassive } from "../fixtures";
import { createWithContext } from "./create";

const story = stories[0];
const viewer = viewerPassive;

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = createWithContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
          stream: () => story,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("PREFERENCES", "profileTab");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  customRenderAppWithContext(context);

  return {
    context,
  };
}

it("render notifications form", async () => {
  const updateNotificationSettings = sinon
    .stub()
    .callsFake((_: any, { input: { clientMutationId, ...notifications } }) => {
      expectAndFail(notifications).toMatchObject({
        onReply: true,
        onFeatured: true,
        onStaffReplies: true,
        onModeration: true,
        digestFrequency: "HOURLY",
      });
      return {
        user: pureMerge<typeof viewer>(viewer, {
          notifications,
        }),
        clientMutationId,
      };
    });
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Mutation: {
          updateNotificationSettings,
        },
      }),
    });
  });

  const container = await screen.findByTestId("profile-account-notifications");
  expect(await axe(container)).toHaveNoViolations();

  // Get the form fields.
  const onReply = within(container).getByRole("checkbox", {
    name: "My comment receives a reply",
  });
  const onStaffReplies = within(container).getByRole("checkbox", {
    name: "A staff member replies to my comment",
  });
  const onModeration = within(container).getByRole("checkbox", {
    name: "My pending comment has been reviewed",
  });
  const onFeatured = within(container).getByRole("checkbox", {
    name: "My comment is featured",
  });
  const digestFrequency = within(container).getByRole("combobox", {
    name: "Send Notifications:",
  });
  const save = within(container).getByRole("button", { name: "Update" });

  // The save button should be disabled for unchanged fields.
  expect(save).toBeDisabled();

  // The digest frequency select should be disabled with no options enabled.
  expect(digestFrequency).toBeDisabled();

  // Enable the options.
  userEvent.click(onReply);
  userEvent.click(onStaffReplies);
  userEvent.click(onModeration);
  userEvent.click(onFeatured);

  // The digest frequency select should now be enabled.
  expect(digestFrequency).toBeEnabled();

  // Change the digest frequency.
  userEvent.selectOptions(digestFrequency, "HOURLY");

  // Submit the form.
  await act(async () => {
    userEvent.click(save);
  });

  // Ensure that the mutation was called and that the save button is now
  // disabled.
  expect(updateNotificationSettings.calledOnce).toEqual(true);
  expect(save).toBeDisabled();

  // Change a notification option.
  userEvent.click(onReply);

  // The save button should now be enabled.
  expect(save).toBeEnabled();

  // Change a notification back (making it pristine).
  await act(async () => {
    userEvent.click(onReply);
  });

  // The save button should now be disabled.
  expect(save).toBeDisabled();
});

it("render empty ignored users list", async () => {
  await createTestRenderer();
  const ignoredCommenters = await screen.findByTestId(
    "profile-account-ignoredCommenters"
  );
  const editButton = within(ignoredCommenters).getByRole("button", {
    name: "Manage ignored commenters",
  });
  userEvent.click(editButton);
  expect(
    within(ignoredCommenters).getByText("You are not currently ignoring anyone")
  ).toBeVisible();
});

it("render ignored users list", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        viewer: () =>
          pureMerge<typeof viewer>(viewer, {
            ignoredUsers: [commenters[0], commenters[1]],
          }),
      },
      Mutation: {
        removeUserIgnore: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            // we sort by username now, so this user
            // comes first because of their username
            userID: commenters[1].id,
          });
          return {};
        },
      },
    }),
  });
  const ignoredCommenters = await screen.findByTestId(
    "profile-account-ignoredCommenters"
  );
  const editButton = within(ignoredCommenters).getByRole("button", {
    name: "Manage ignored commenters",
  });
  userEvent.click(editButton);
  within(ignoredCommenters).getByText(commenters[0].username!);
  within(ignoredCommenters).getByText(commenters[1].username!);

  const stopIgnoreButtons = within(ignoredCommenters).getAllByRole("button", {
    name: "Stop ignoring",
  });

  // Stop ignoring first users.
  userEvent.click(stopIgnoreButtons[0]);

  // First user should be replaced with "you are no longer ignoring"
  expect(
    await within(ignoredCommenters).findByText("You are no longer ignoring")
  ).toBeVisible();
  expect(
    within(ignoredCommenters).getByText(commenters[0].username!)
  ).toBeVisible();
});
