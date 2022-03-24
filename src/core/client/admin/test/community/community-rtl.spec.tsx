import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import customRenderAppWithContext from "coral-admin/test/customRenderAppWithContext";
import { pureMerge } from "coral-common/utils";
import {
  GQLResolver,
  GQLUSER_ROLE,
  QueryToSettingsResolver,
  QueryToUsersResolver,
} from "coral-framework/schema";
import {
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
  await screen.findByTestId("community-container");

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
  changeRoleButton.click();

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user role"
  );
  const staffButton = await within(popup).findByRole("button", {
    name: "Staff",
  });
  // userEvent.click(...) throws an error here cause the button is set to
  // pointer-events: none when disabled. So we do the other `.click()` here.
  staffButton.click();

  expect(resolvers.Mutation!.updateUserRole!.called).toBe(true);
});

it("can't change role as a moderator", async () => {
  const moderator = users.moderators[0];
  await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        viewer: () => moderator,
      },
    }),
  });

  expect(screen.getByLabelText("Change user status")).toBeVisible();
  expect(screen.queryByLabelText("Change role")).toBeNull();
});

it("change user role to Site Moderator and add sites to moderate", async () => {
  const user = users.commenters[0];
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
      updateUserModerationScopes: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          moderationScopes: {
            siteIDs: ["site-1"],
          },
          userID: user.id,
        });
        const userRecord = pureMerge<typeof user>(user, {
          moderationScopes: {
            scoped: true,
            sites: [sites[0]],
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
  // userEvent.click(...) throws an error here cause the button is set to
  // pointer-events: none when disabled. So we do the other `.click()` here.
  siteModButton.click();

  const modal = await screen.findByTestId("site-role-modal");

  // The submit button should be disabled until at least 1 site is selected
  const submitButton = await screen.findByTestId(
    "site-role-modal-submitButton"
  );
  expect(submitButton).toBeDisabled();

  const siteSearchField = within(modal).getByRole("textbox", {
    name: "Search by site name",
  });
  userEvent.type(siteSearchField, "Test");

  const siteSearchButton = await screen.findByTestId("site-search-button");
  userEvent.click(siteSearchButton);

  const siteSearchList = await screen.findByTestId("site-search-list");
  const testSiteButton = within(siteSearchList).getByRole("button", {
    name: "Test Site",
  });
  userEvent.click(testSiteButton);

  const assignButton = within(modal).getByRole("button", { name: "Assign" });
  userEvent.click(assignButton);

  await waitFor(() =>
    expect(resolvers.Mutation!.updateUserRole!.called).toBe(true)
  );
  await waitFor(() =>
    expect(resolvers.Mutation!.updateUserModerationScopes!.called).toBe(true)
  );
});

it("promote user role as a site moderator", async () => {
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
  // userEvent.click(...) throws an error here cause the button is set to
  // pointer-events: none when disabled. So we do the other `.click()` here.
  siteModButton.click();

  await waitFor(() => screen.getByTestId("siteModeratorActions-modal"));
  const assignButton = screen.getByRole("button", { name: "Assign" });
  userEvent.click(assignButton);

  await waitFor(() =>
    expect(resolvers.Mutation!.promoteModerator!.called).toBe(true)
  );
});

it("demote user role as a site moderator", async () => {
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
          siteIDs: [sites[0].id],
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
    name: "Remove my sites from moderator",
  });
  // userEvent.click(...) throws an error here cause the button is set to
  // pointer-events: none when disabled. So we do the other `.click()` here.
  siteModButton.click();

  await screen.findByTestId("siteModeratorActions-modal");
  const removeButton = screen.getByRole("button", { name: "Remove" });
  removeButton.click();

  await waitFor(() =>
    expect(resolvers.Mutation!.demoteModerator!.called).toBe(true)
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

  const loadMore = screen.getByText("Load More");
  loadMore.click();

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

  const searchField = screen.getByLabelText("Search by username", {
    exact: false,
  });
  userEvent.click(searchField);
  userEvent.type(searchField, "search{enter}");

  await waitFor(() =>
    expect(
      screen.queryByText(
        "We could not find anyone in your community matching your criteria.",
        { exact: false }
      )
    ).toBeInTheDocument()
  );
});
