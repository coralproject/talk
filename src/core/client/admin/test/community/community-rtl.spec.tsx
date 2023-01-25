import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import customRenderAppWithContext from "coral-admin/test/customRenderAppWithContext";
import { pureMerge } from "coral-common/utils";
import {
  GQLResolver,
  GQLUSER_ROLE,
  GQLUsersConnection,
  QueryToSettingsResolver,
  QueryToUsersResolver,
} from "coral-framework/schema";
import {
  createFixture,
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import {
  communityUsers,
  disabledEmail,
  disabledLocalAuth,
  disabledLocalAuthAdminTargetFilter,
  disabledLocalRegistration,
  emptyCommunityUsers,
  settings,
  settingsWithMultisite,
  siteConnection,
  sites,
  users,
} from "../fixtures";

const adminViewer = users.admins[0];

const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {}
) => {
  const { context } = createContext({
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: createQueryResolverStub<QueryToSettingsResolver>(
            () => settings
          ),
          users: createQueryResolverStub<QueryToUsersResolver>(
            () => communityUsers
          ),
          viewer: () => adminViewer,
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

  return context;
};

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/community");
});

it("renders empty community", async () => {
  await createTestRenderer({
    resolvers: {
      Query: {
        users: createQueryResolverStub<QueryToUsersResolver>(
          () => emptyCommunityUsers
        ),
      },
    },
  });
});

it("renders the invite button", async () => {
  await createTestRenderer();

  const inviteUsersButton = await screen.findByRole("button", {
    name: "Invite",
  });
  userEvent.click(inviteUsersButton);

  const modal = await screen.findByTestId("invite-users-modal");
  expect(modal).toBeVisible();
});

it("renders with invite button when viewed with admin user", async () => {
  const admin = users.admins[0];
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        viewer: () => admin,
      },
    }),
  });

  const inviteButton = await screen.findByTestId("invite-users");
  expect(inviteButton).toBeDefined();
});

it("renders without invite button when viewed with non-admin user", async () => {
  const moderator = users.moderators[0];
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        viewer: () => moderator,
      },
    }),
  });

  expect(screen.queryByTestId("invite-users")).not.toBeInTheDocument();
});

it("renders without invite button when email disabled", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        settings: createQueryResolverStub<QueryToSettingsResolver>(
          () => disabledEmail
        ),
      },
    }),
  });

  // We use `queryByTestId` here because it will throw an error
  // if the object does not exist when we use `findByTestId`
  const inviteButton = screen.queryByTestId("invite-users");
  expect(inviteButton).toBeNull();
});

it("renders without invite button when admin target filter disabled", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        settings: createQueryResolverStub<QueryToSettingsResolver>(
          () => disabledLocalAuthAdminTargetFilter
        ),
      },
    }),
  });

  // We use `queryByTestId` here because it will throw an error
  // if the object does not exist when we use `findByTestId`
  const inviteButton = screen.queryByTestId("invite-users");
  expect(inviteButton).toBeNull();
});

it("renders without invite button when local auth disabled", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        settings: createQueryResolverStub<QueryToSettingsResolver>(
          () => disabledLocalAuth
        ),
      },
    }),
  });

  // We use `queryByTestId` here because it will throw an error
  // if the object does not exist when we use `findByTestId`
  const inviteButton = screen.queryByTestId("invite-users");
  expect(inviteButton).toBeNull();
});

it("renders without invite button when local auth registration disabled", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        settings: createQueryResolverStub<QueryToSettingsResolver>(
          () => disabledLocalRegistration
        ),
      },
    }),
  });

  // We use `queryByTestId` here because it will throw an error
  // if the object does not exist when we use `findByTestId`
  const inviteButton = screen.queryByTestId("invite-users");
  expect(inviteButton).toBeNull();
});

it("filter by role", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        users: createQueryResolverStub<QueryToUsersResolver>(
          () => emptyCommunityUsers
        ),
      },
    }),
  });

  const selectField = await screen.findByLabelText("Search by role");
  userEvent.selectOptions(selectField, ["Commenters"]);

  await screen.findByText("We could not find anyone", { exact: false });
});

it("can't change viewer role", async () => {
  await createTestRenderer();

  const viewerRow = await screen.findByTestId(
    `community-row-${adminViewer.id}`
  );
  expect(
    within(viewerRow).queryByLabelText("Change role")
  ).not.toBeInTheDocument();
});

it("change user role", async () => {
  const user = users.commenters[0];
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateUserRole: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
          role: GQLUSER_ROLE.STAFF,
        });
        const userRecord = pureMerge<typeof user>(user, {
          role: variables.role,
        });
        return {
          user: userRecord,
        };
      },
    },
  });
  await createTestRenderer({
    resolvers,
  });

  const userRow = await screen.findByTestId(`community-row-${user.id}`);
  const changeRoleButton = within(userRow).getByLabelText("Change role");
  userEvent.click(changeRoleButton);

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user role"
  );
  const staffButton = await within(popup).findByRole("button", {
    name: "Staff",
  });
  fireEvent.click(staffButton);

  expect(resolvers.Mutation!.updateUserRole!.called).toBe(true);
});

it("no one may change an admins role", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      users: createQueryResolverStub<QueryToUsersResolver>(() =>
        createFixture<GQLUsersConnection>({
          edges: users.admins,
          nodes: users.admins,
        })
      ),
    },
  });
  await createTestRenderer({
    resolvers,
  });

  const container = await screen.findByTestId("community-container");
  expect(container).toBeDefined();
  expect(within(container).getAllByRole("row").length).toEqual(
    users.admins.length
  );
  expect(
    within(container).queryByLabelText("Change role")
  ).not.toBeInTheDocument();
});

it("org mods may allocate site mods", async () => {
  const orgModerator = users.moderators[0];
  const commenter = users.commenters[0];
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      viewer: () => orgModerator,
      user: () => commenter,
      settings: () => ({ ...settings, multisite: true }),
      sites: () => siteConnection,
    },
    Mutation: {
      updateUserRole: ({ variables }) => {
        expectAndFail(variables.siteIDs).toContain(sites[0].id);
        return {
          user: {
            ...commenter,
            role: variables.role,
          },
        };
      },
    },
  });

  await createTestRenderer({
    resolvers,
  });
  await screen.findByTestId("community-container");

  const userStatus = screen.getAllByLabelText("Change user status")[0];
  expect(userStatus).toBeVisible();

  const userRow = await screen.findByTestId(`community-row-${commenter.id}`);
  const changeRoleButton = within(userRow).getByLabelText("Change role");

  await act(async () => {
    userEvent.click(changeRoleButton);
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user role"
  );
  expect(popup).toBeVisible();

  const siteModeratorButton = await within(popup).findByRole("button", {
    name: "Site Moderator",
  });
  await act(async () => {
    fireEvent.click(siteModeratorButton);
  });

  const siteRolePopup = await within(userRow).findByLabelText(
    "A modal for managing the scope of a site scoped role"
  );

  expect(siteRolePopup).toBeVisible();

  const searchBar = within(siteRolePopup).getByLabelText(
    "Search by site name",
    {
      exact: false,
    }
  );

  userEvent.type(searchBar, sites[0].name);

  const siteSearchButton = await screen.findByTestId("site-search-button");
  await act(async () => {
    userEvent.click(siteSearchButton);
  });

  const testSiteButton = await within(siteRolePopup).findByRole("button", {
    name: sites[0].name,
  });
  await act(async () => {
    userEvent.click(testSiteButton);
  });

  const assignButton = within(siteRolePopup).getByRole("button", {
    name: "Update",
  });
  expect(assignButton).toBeEnabled();
  await act(async () => {
    userEvent.click(assignButton);
  });

  expect(resolvers.Mutation!.updateUserRole!.called).toBe(true);
});

it("change user role to Site Moderator and add sites to moderate", async () => {
  const user = users.commenters[0];
  const site = sites[0];
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateUserRole: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
          role: GQLUSER_ROLE.MODERATOR,
        });
        const userRecord = pureMerge<typeof user>(user, {
          role: variables.role,
        });
        return {
          user: userRecord,
        };
      },
      promoteModerator: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          siteIDs: [site.id],
          userID: user.id,
        });
        const userRecord = pureMerge<typeof user>(user, {
          moderationScopes: {
            scoped: true,
            sites: [site],
          },
          role: GQLUSER_ROLE.MODERATOR,
        });
        return {
          user: userRecord,
        };
      },
    },
    Query: {
      settings: () => settingsWithMultisite,
      sites: () => siteConnection,
    },
  });
  await createTestRenderer({
    resolvers,
  });

  const userRow = await screen.findByTestId(`community-row-${user.id}`);
  const changeRoleButton = within(userRow).getByLabelText("Change role");
  userEvent.click(changeRoleButton);

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user role"
  );

  const siteModButton = within(popup).getByRole("button", {
    name: "Site Moderator",
  });
  fireEvent.click(siteModButton);

  const modal = await screen.findByTestId("site-role-modal");

  // The submit button should be disabled until at least 1 site is selected
  const submitButton = await screen.findByRole("button", {
    name: "Update",
  });
  expect(submitButton).toBeDisabled();

  const siteSearchField = within(modal).getByRole("textbox", {
    name: "Search by site name",
  });
  userEvent.type(siteSearchField, "Test");

  const siteSearchButton = await screen.findByTestId("site-search-button");
  await act(async () => {
    userEvent.click(siteSearchButton);
  });

  const siteSearchList = await screen.findByTestId("site-search-list");
  const testSiteButton = within(siteSearchList).getByRole("button", {
    name: "Test Site",
  });
  await act(async () => {
    userEvent.click(testSiteButton);
  });

  const assignButton = within(modal).getByRole("button", { name: "Update" });
  await act(async () => {
    userEvent.click(assignButton);
  });

  await waitFor(() =>
    expect(resolvers.Mutation!.updateUserRole!.called).toBe(true)
  );
});

it("add moderation scopes as a site moderator", async () => {
  const siteModerator = users.moderators[1];
  const user = users.commenters[0];
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      viewer: () => siteModerator,
      settings: () => settingsWithMultisite,
    },
    Mutation: {
      promoteModerator: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
          siteIDs: [sites[0].id],
        });
        const userRecord = pureMerge<typeof user>(user, {
          moderationScopes: { scoped: true, sites: [sites[0]] },
        });
        return {
          user: userRecord,
        };
      },
    },
  });
  await createTestRenderer({
    resolvers,
  });

  const userRow = await screen.findByTestId(`community-row-${user.id}`);
  const changeRoleButton = within(userRow).getByLabelText("Change role");
  userEvent.click(changeRoleButton);

  const popup = within(userRow).getByLabelText(
    "A dropdown to promote/demote a user to/from sites"
  );

  const siteModButton = within(popup).getByRole("button", {
    name: "Site Moderator",
  });
  fireEvent.click(siteModButton);

  await waitFor(() => screen.getByTestId("siteModeratorActions-modal"));

  const siteCheckBoxes = screen.getAllByRole("checkbox");
  siteCheckBoxes.forEach((checkbox) => fireEvent.click(checkbox));

  const assignButton = screen.getByRole("button", { name: "Update" });
  userEvent.click(assignButton);

  await waitFor(() =>
    expect(resolvers.Mutation!.promoteModerator!.called).toBe(true)
  );
});

it("remove moderation scopes as a site moderator", async () => {
  const siteModeratorViewer = users.moderators[1];
  const siteModeratorUser = users.moderators[2];

  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      viewer: () => siteModeratorViewer,
      settings: () => settingsWithMultisite,
    },
    Mutation: {
      demoteModerator: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: siteModeratorUser.id,
          siteIDs: siteModeratorViewer.moderationScopes?.siteIDs,
        });
        const userRecord = pureMerge<typeof siteModeratorUser>(
          siteModeratorUser,
          {
            moderationScopes: { scoped: false, sites: [] },
          }
        );
        return {
          user: userRecord,
        };
      },
    },
  });
  await createTestRenderer({
    resolvers,
  });

  const userRow = await screen.findByTestId(
    `community-row-${siteModeratorUser.id}`
  );
  const changeRoleButton = within(userRow).getByLabelText("Change role");
  userEvent.click(changeRoleButton);

  const popup = within(userRow).getByLabelText(
    "A dropdown to promote/demote a user to/from sites"
  );
  const siteModButton = within(popup).getByRole("button", {
    name: "Site Moderator",
  });
  fireEvent.click(siteModButton);

  await screen.findByTestId("siteModeratorActions-modal");

  const siteCheckBoxes = screen.getAllByRole("checkbox");

  siteCheckBoxes.forEach((checkbox) => fireEvent.click(checkbox));

  const updateButton = screen.getByRole("button", { name: "Update" });
  userEvent.click(updateButton);

  await waitFor(() =>
    expect(resolvers.Mutation!.demoteModerator!.called).toBe(true)
  );
});

it("allows admins to promote site mods to org mod", async () => {
  const viewer = users.admins[0];
  const siteModeratorUser = users.moderators[2];

  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      viewer: () => viewer,
      settings: () => settingsWithMultisite,
    },
    Mutation: {
      updateUserRole: ({ variables }) => {
        expectAndFail(variables.siteIDs).toEqual([]);
        const userRecord = pureMerge<typeof siteModeratorUser>(
          siteModeratorUser,
          {
            role: GQLUSER_ROLE.MODERATOR,
            moderationScopes: { scoped: false, sites: [] },
          }
        );
        return {
          user: userRecord,
        };
      },
    },
  });
  await createTestRenderer({
    resolvers,
  });

  const userRow = await screen.findByTestId(
    `community-row-${siteModeratorUser.id}`
  );
  const changeRoleButton = within(userRow).getByLabelText("Change role");
  userEvent.click(changeRoleButton);

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user role"
  );
  const orgModButton = within(popup).getByRole("button", {
    name: "Organization Moderator",
  });
  fireEvent.click(orgModButton);

  await waitFor(() =>
    expect(resolvers.Mutation!.updateUserRole!.called).toBe(true)
  );
});

it("load more", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        users: ({ callCount }) => {
          switch (callCount) {
            case 0:
              return {
                edges: [
                  {
                    node: adminViewer,
                    cursor: adminViewer.createdAt,
                  },
                  {
                    node: users.commenters[0],
                    cursor: users.commenters[0].createdAt,
                  },
                ],
                pageInfo: {
                  endCursor: users.commenters[0].createdAt,
                  hasNextPage: true,
                },
              };
            default:
              return {
                edges: [
                  {
                    node: users.commenters[1],
                    cursor: users.commenters[1].createdAt,
                  },
                ],
                pageInfo: {
                  endCursor: users.commenters[1].createdAt,
                  hasNextPage: false,
                },
              };
          }
        },
      },
    }),
  });

  const loadMore = await screen.findByText("Load More");
  userEvent.click(loadMore);

  await waitFor(() =>
    expect(screen.queryByText("Load More")).not.toBeInTheDocument()
  );

  // Make sure third user was added.
  expect(screen.getByText(users.commenters[1].username!)).toBeVisible();
});

it("filter by search", async () => {
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        users: ({ variables, callCount }) => {
          switch (callCount) {
            case 0:
              return communityUsers;
            default:
              expectAndFail(variables.query).toBe("search");
              return emptyCommunityUsers;
          }
        },
      },
    }),
  });

  const searchField = await screen.findByLabelText("Search by username", {
    exact: false,
  });
  userEvent.click(searchField);
  fireEvent.change(searchField, { target: { value: "search" } });
  const searchButton = await screen.findByRole("button", { name: "Search" });
  await act(async () => {
    userEvent.click(searchButton);
  });

  await waitFor(() =>
    expect(
      screen.queryByText(
        "We could not find anyone in your community matching your criteria.",
        { exact: false }
      )
    ).toBeInTheDocument()
  );
});

it("can't change admin status but can for mods and staff", async () => {
  await createTestRenderer();
  const admin = await screen.findByRole("row", {
    name: "Markus markus@test.com 07/06/18, 06:24 PM Admin Active",
  });
  expect(
    within(admin).queryByLabelText("Change user status")
  ).not.toBeInTheDocument();

  const moderator = screen.getByRole("row", {
    name: "Lukas lukas@test.com 07/06/18, 06:24 PM Moderator Active",
  });
  const staff = screen.getByRole("row", {
    name: "Huy huy@test.com 07/06/18, 06:24 PM Staff Active",
  });
  expect(within(moderator).getByLabelText("Change user status")).toBeVisible();
  expect(within(staff).getByLabelText("Change user status")).toBeVisible();
});

it("can't ban org moderators but can change other status for them", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      settings: () => settingsWithMultisite,
    },
  });
  await createTestRenderer({ resolvers });
  const orgModRow = await screen.findByRole("row", {
    name: "Lukas lukas@test.com 07/06/18, 06:24 PM Organization Moderator Active",
  });
  const changeStatusButton = within(orgModRow).getByRole("button", {
    name: "Change user status",
  });
  userEvent.click(changeStatusButton);
  const dropdown = within(orgModRow).getByLabelText(
    "A dropdown to change the user status"
  );
  expect(
    within(dropdown).getByRole("button", { name: "Manage Ban" })
  ).toBeDisabled();
  expect(
    within(dropdown).getByRole("button", { name: "Message" })
  ).not.toBeDisabled();
});

it("doesn't show All Sites option when banning moderators and bans them on specific sites", async () => {
  const user = users.moderators[1];
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      settings: () => settingsWithMultisite,
    },
    Mutation: {
      updateUserBan: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
          banSiteIDs: ["site-2"],
        });
        const userRecord = pureMerge<typeof user>(user, {
          status: {
            ban: { sites: [{ id: sites[1].id }] },
          },
        });
        return {
          user: userRecord,
        };
      },
    },
  });
  await act(async () => {
    await createTestRenderer({ resolvers });
  });
  const moderatorRow = await screen.findByRole("row", {
    name: "Ginger ginger@test.com 07/06/18, 06:24 PM Site Moderator Active",
  });
  const changeStatusButton = within(moderatorRow).getByRole("button", {
    name: "Change user status",
  });
  userEvent.click(changeStatusButton);
  const dropdown = within(moderatorRow).getByLabelText(
    "A dropdown to change the user status"
  );
  const manageBan = within(dropdown).getByRole("button", {
    name: "Manage Ban",
  });
  fireEvent.click(manageBan);

  const modal = screen.getByLabelText(
    "Are you sure you want to manage the ban status of Ginger?"
  );

  // All sites shouldn't be an option for banning site moderators
  expect(
    within(modal).queryByRole("radio", { name: "All sites" })
  ).not.toBeInTheDocument();

  const specificSites = within(modal).getByRole("radio", {
    name: "Specific sites",
  });
  userEvent.click(specificSites);

  const siteSearchTextbox = within(modal).getByRole("textbox", {
    name: "Search by site name",
  });
  userEvent.type(siteSearchTextbox, "Second");
  const siteSearchButton = within(modal).getByRole("button", {
    name: "Search",
  });
  userEvent.click(siteSearchButton);
  await within(modal).findByTestId("site-search-list");
  userEvent.click(within(modal).getByText("Second Site"));
  userEvent.click(within(modal).getByRole("button", { name: "Save" }));

  // Moderator should be banned on one site
  expect(await within(moderatorRow).findByText("Banned (1)")).toBeVisible();
  expect(resolvers.Mutation!.updateUserBan!.called).toBe(true);
});
