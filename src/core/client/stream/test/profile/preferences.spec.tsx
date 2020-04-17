import sinon from "sinon";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { commenters, settings, stories, viewerPassive } from "../fixtures";
import create from "./create";

const story = stories[0];
const viewer = viewerPassive;

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
  const ignoredCommenters = await waitForElement(() =>
    within(testRenderer.root).queryByTestID("profile-account-ignoredCommenters")
  );

  return {
    testRenderer,
    context,
    ignoredCommenters,
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
  const { testRenderer } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        updateNotificationSettings,
      },
    }),
  });
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("profile-account-notifications")
  );
  expect(await within(container).axe()).toHaveNoViolations();
  const form = within(container).getByType("form");

  // Get the form fields.
  const onReply = await waitForElement(() =>
    within(form).getByID("onReply", { exact: false })
  );
  const onStaffReplies = await waitForElement(() =>
    within(form).getByID("onStaffReplies", { exact: false })
  );
  const onModeration = await waitForElement(() =>
    within(form).getByID("onModeration", { exact: false })
  );
  const onFeatured = await waitForElement(() =>
    within(form).getByID("onFeatured", { exact: false })
  );
  const digestFrequency = await waitForElement(() =>
    within(form).getByID("digestFrequency", { exact: false })
  );
  const save = await waitForElement(() => within(form).getByType("button"));

  // The save button should be disabled for unchanged fields.
  expect(save.props.disabled).toEqual(true);

  // The digest frequency select should be disabled with no options enabled.
  expect(digestFrequency.props.disabled).toEqual(true);

  // Enable the options.
  act(() => {
    onReply.props.onChange(true);
    onStaffReplies.props.onChange(true);
    onModeration.props.onChange(true);
    onFeatured.props.onChange(true);
  });

  // The digest frequency select should now be enabled.
  expect(digestFrequency.props.disabled).toEqual(false);

  // Change the digest frequency.
  act(() => {
    digestFrequency.props.onChange("HOURLY");
  });

  // Submit the form.
  await act(async () => {
    await form.props.onSubmit();
  });

  // Ensure that the mutation was called and that the save button is now
  // disabled.
  expect(updateNotificationSettings.calledOnce).toEqual(true);
  expect(save.props.disabled).toEqual(true);

  // Change a notification option.
  act(() => {
    onReply.props.onChange(false);
  });

  // The save button should now be enabled.
  expect(save.props.disabled).toEqual(false);

  // Change a notification back (making it pristine).
  act(() => {
    onReply.props.onChange(true);
  });

  // The save button should now be disabled.
  expect(save.props.disabled).toEqual(true);
});

it("render empty ignored users list", async () => {
  const { ignoredCommenters } = await createTestRenderer();
  const editButton = within(ignoredCommenters).getByText("Manage");
  act(() => {
    editButton.props.onClick();
  });
  await waitForElement(() =>
    within(ignoredCommenters).getByText(
      "You are not currently ignoring anyone",
      {
        exact: false,
      }
    )
  );
});

it("render ignored users list", async () => {
  const { ignoredCommenters } = await createTestRenderer({
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
  const editButton = within(ignoredCommenters).getByText("Manage");
  act(() => {
    editButton.props.onClick();
  });
  within(ignoredCommenters).getByText(commenters[0].username!);
  within(ignoredCommenters).getByText(commenters[1].username!);

  const stopIgnoreButtons = within(ignoredCommenters).getAllByText(
    "Stop ignoring",
    { selector: "button" }
  );

  // Stop ignoring first users.
  await act(async () => {
    stopIgnoreButtons[0].props.onClick();
  });

  // First user should be replaced with "you are no longer ignoring"
  await waitForElement(() =>
    within(ignoredCommenters).getByText("You are no longer ignoring")
  );
  within(ignoredCommenters).getByText(commenters[0].username!);
});
