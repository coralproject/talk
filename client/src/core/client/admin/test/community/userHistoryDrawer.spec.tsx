import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { pureMerge } from "coral-common/common/lib/utils";
import {
  GQLFEATURE_FLAG,
  GQLResolver,
  GQLUserDeletionUpdateType,
} from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
import {
  communityUsers,
  rejectedComments,
  settings,
  settingsWithMultisite,
  siteConnection,
  unmoderatedComments,
  users,
} from "../fixtures";

const viewer = users.admins[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/community");
});

const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {},
  settingsOverride?: any,
  usersOverride?: any
) => {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => (settingsOverride ? settingsOverride : settings),
          users: ({ variables }) => {
            expectAndFail(variables.role).toBeFalsy();
            return usersOverride ? usersOverride : communityUsers;
          },
          user: () => users.commenters[0],
          viewer: () => viewer,
          sites: () => siteConnection,
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
  return { context };
};

it("user drawer is open and both user name and user id are visible", async () => {
  await createTestRenderer();
  await screen.findByTestId("community-container");
  const isabelle = await screen.findByRole("button", { name: "Isabelle" });
  await act(async () => {
    userEvent.click(isabelle);
  });
  const isabelleUserHistory = await screen.findByTestId(
    "userHistoryDrawer-modal"
  );
  expect(
    await within(isabelleUserHistory).findByText("Isabelle")
  ).toBeVisible();
  expect(
    within(isabelleUserHistory).queryByText(users.commenters[0].id)
  ).toBeInTheDocument();
});

it("user drawer is open and user can be scheduled for deletion and have deletion canceled", async () => {
  const user = users.commenters[0];
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      scheduleAccountDeletion: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
        });
        const userRecord = pureMerge<typeof user>(user, {
          scheduledDeletionDate: "2024-01-11T20:48:20.317+00:00",
          status: {
            deletion: {
              history: [
                {
                  updateType: GQLUserDeletionUpdateType.REQUESTED,
                  createdAt: "2018-11-29T16:01:51.897Z",
                  createdBy: viewer,
                },
              ],
            },
          },
        });
        return {
          user: userRecord,
        };
      },
      cancelScheduledAccountDeletion: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
        });
        const userRecord = pureMerge<typeof user>(user, {
          scheduledDeletionDate: null,
          status: {
            deletion: {
              history: [
                {
                  updateType: GQLUserDeletionUpdateType.REQUESTED,
                  createdAt: "2024-01-10T16:01:51.897Z",
                  createdBy: viewer,
                },
                {
                  updateType: GQLUserDeletionUpdateType.CANCELED,
                  createdAt: "2024-01-10T16:25:51.897Z",
                  createdBy: viewer,
                },
              ],
            },
          },
        });
        return {
          user: userRecord,
        };
      },
    },
  });
  await createTestRenderer({ resolvers });
  await screen.findByTestId("community-container");
  const isabelle = await screen.findByRole("button", { name: "Isabelle" });
  await act(async () => {
    userEvent.click(isabelle);
  });
  const isabelleUserHistory = await screen.findByTestId(
    "userHistoryDrawer-modal"
  );
  const historyTab = await within(isabelleUserHistory).findByRole("tab", {
    name: "Tab: time-reverse Account History",
  });
  await act(async () => {
    userEvent.click(historyTab);
  });
  const tabRegion = screen.getByRole("region", {
    name: "Tab: time-reverse Account History",
  });
  const deleteAccountButton = within(tabRegion).getByRole("button", {
    name: "Delete account",
  });
  expect(deleteAccountButton).toBeVisible();

  await act(async () => {
    userEvent.click(deleteAccountButton);
  });
  const popover = screen.getByRole("dialog", {
    name: "A popover menu to delete a user's account",
  });
  const deleteButton = within(popover).getByRole("button", { name: "Delete" });
  expect(deleteButton).toBeDisabled();
  const input = within(popover).getByRole("textbox");
  fireEvent.change(input, { target: { value: "delete" } });

  expect(deleteButton).toBeEnabled();
  fireEvent.click(deleteButton);
  expect(resolvers.Mutation!.scheduleAccountDeletion!.called).toBe(true);
  await screen.findByText("User deletion activated");
  const cancelDeletionButton = screen.getByRole("button", {
    name: "Cancel user deletion",
  });
  userEvent.click(cancelDeletionButton);
  expect(resolvers.Mutation!.cancelScheduledAccountDeletion!.called).toBe(true);
});

it("opens user drawer and shows external profile url link when has feature flag and configured", async () => {
  const settingsOverride = settings;
  settingsOverride.featureFlags = [
    GQLFEATURE_FLAG.CONFIGURE_PUBLIC_PROFILE_URL,
  ];
  settingsOverride.externalProfileURL = "https://example.com/users/$USER_NAME";
  await createTestRenderer({}, settingsOverride);

  await screen.findByTestId("community-container");
  const isabelle = await screen.findByRole("button", { name: "Isabelle" });
  await act(async () => {
    userEvent.click(isabelle);
  });

  const isabelleUserHistory = await screen.findByTestId(
    "userHistoryDrawer-modal"
  );
  const externalProfileURLLink = await within(isabelleUserHistory).findByRole(
    "link"
  );

  // has correct href and set up to open external profile url link in new tab
  expect(externalProfileURLLink).toHaveAttribute(
    "href",
    "https://example.com/users/Isabelle"
  );
  expect(externalProfileURLLink).toHaveAttribute("target", "_blank");
});

it("opens user drawer and does not show external profile url link when doesn't have feature flag", async () => {
  const settingsOverride = settings;
  settingsOverride.featureFlags = [];
  settingsOverride.externalProfileURL = "https://example.com/users/$USER_NAME";
  await createTestRenderer({}, settingsOverride);

  await screen.findByTestId("community-container");
  const isabelle = await screen.findByRole("button", { name: "Isabelle" });
  await act(async () => {
    userEvent.click(isabelle);
  });

  const isabelleUserHistory = await screen.findByTestId(
    "userHistoryDrawer-modal"
  );
  expect(within(isabelleUserHistory).queryByRole("link")).toBeNull();
});

it("all comments selected, comment is visible in all comments", async () => {
  const usersOverride = communityUsers;
  usersOverride.edges[5].node.allComments = {
    edges: [
      {
        node: unmoderatedComments[0],
        cursor: unmoderatedComments[0].createdAt,
      },
    ],
    nodes: [],
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage: false,
    },
  };
  await createTestRenderer({}, settingsWithMultisite, usersOverride);

  await screen.findByTestId("community-container");
  const isabelle = await screen.findByRole("button", { name: "Isabelle" });
  await act(async () => {
    userEvent.click(isabelle);
  });
  const isabelleUserHistory = await screen.findByTestId(
    "userHistoryDrawer-modal"
  );
  expect(
    within(isabelleUserHistory).queryByText(
      "Isabelle has not submitted any comments."
    )
  ).toBeNull();
  expect(
    within(isabelleUserHistory).queryByText("This is an unmoderated comment.")
  ).toBeInTheDocument();
});

it("select rejected comments, rejected comment is visible", async () => {
  const usersOverride = communityUsers;
  usersOverride.edges[5].node.rejectedComments = {
    edges: [
      {
        node: rejectedComments[0],
        cursor: rejectedComments[0].createdAt,
      },
    ],
    nodes: [],
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage: false,
    },
  };
  await createTestRenderer({}, settingsWithMultisite, usersOverride);

  await screen.findByTestId("community-container");
  const isabelle = await screen.findByRole("button", { name: "Isabelle" });
  await act(async () => {
    userEvent.click(isabelle);
  });

  const isabelleUserHistory = await screen.findByTestId(
    "userHistoryDrawer-modal"
  );
  const rejectedCommentsTab =
    within(isabelleUserHistory).queryAllByRole("tab")[1];
  userEvent.click(rejectedCommentsTab);
  await waitFor(() => {
    expect(
      within(isabelleUserHistory).queryByText(
        "This is the last random sentence I will be writing and I am going to stop mid-sent"
      )
    ).toBeInTheDocument();
  });
});
