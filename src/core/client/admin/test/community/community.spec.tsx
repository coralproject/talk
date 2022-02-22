import { noop } from "lodash";
import { v1 as uuid } from "uuid";

import { pureMerge } from "coral-common/utils";
import {
  GQLResolver,
  GQLUSER_ROLE,
  GQLUSER_STATUS,
  QueryToSettingsResolver,
  QueryToUsersResolver,
} from "coral-framework/schema";
import {
  act,
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  wait,
  waitForElement,
  waitUntilThrow,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
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

const viewer = users.admins[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/community");
});

const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {}
) => {
  const { testRenderer } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          users: ({ variables }) => {
            expectAndFail(variables.role).toBeFalsy();
            return communityUsers;
          },
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
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("community-container")
  );
  return { testRenderer, container };
};

it("renders community", async () => {
  const { container } = await createTestRenderer();
  expect(within(container).toJSON()).toMatchSnapshot();
});

it("renders empty community", async () => {
  const { container } = await createTestRenderer({
    resolvers: {
      Query: {
        users: createQueryResolverStub<QueryToUsersResolver>(
          () => emptyCommunityUsers
        ),
      },
    },
  });
  expect(within(container).toJSON()).toMatchSnapshot();
});

it("renders the invite button when clicked", async () => {
  const { container } = await createTestRenderer();

  await act(async () =>
    within(container).getByTestID("invite-users-button").props.onClick()
  );

  expect(within(container).getByTestID("invite-users-modal")).toBeDefined();
});

it("renders with invite button when viewed with admin user", async () => {
  const admin = users.admins[0];
  const { container } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        viewer: () => admin,
      },
    }),
  });
  expect(within(container).queryByTestID("invite-users")).toBeDefined();
});

it("renders without invite button when viewed with non-admin user", async () => {
  const moderator = users.moderators[0];
  const { container } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        viewer: () => moderator,
      },
    }),
  });
  expect(within(container).queryByTestID("invite-users")).toBeNull();
});

it("renders without invite button when email disabled", async () => {
  const { container } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        settings: createQueryResolverStub<QueryToSettingsResolver>(
          () => disabledEmail
        ),
      },
    }),
  });
  expect(within(container).queryByTestID("invite-users")).toBeNull();
});

it("renders without invite button when admin target filter disabled", async () => {
  const { container } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        settings: createQueryResolverStub<QueryToSettingsResolver>(
          () => disabledLocalAuthAdminTargetFilter
        ),
      },
    }),
  });
  expect(within(container).queryByTestID("invite-users")).toBeNull();
});

it("renders without invite button when local auth disabled", async () => {
  const { container } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        settings: createQueryResolverStub<QueryToSettingsResolver>(
          () => disabledLocalAuth
        ),
      },
    }),
  });
  expect(within(container).queryByTestID("invite-users")).toBeNull();
});

it("renders without invite button when local auth registration disabled", async () => {
  const { container } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        settings: createQueryResolverStub<QueryToSettingsResolver>(
          () => disabledLocalRegistration
        ),
      },
    }),
  });
  expect(within(container).queryByTestID("invite-users")).toBeNull();
});

it("filter by role", async () => {
  const { container } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        users: ({ variables, callCount }) => {
          switch (callCount) {
            case 0:
              return communityUsers;
            default:
              expectAndFail(variables.role).toBe(GQLUSER_ROLE.COMMENTER);
              return emptyCommunityUsers;
          }
        },
      },
    }),
  });

  const selectField = within(container).getByLabelText("Search by role");
  const commentersOption = within(selectField).getByText("Commenters");

  await act(async () => {
    selectField.props.onChange({
      target: { value: commentersOption.props.value.toString() },
    });
    await waitForElement(() =>
      within(container).getByText("We could not find anyone", { exact: false })
    );
  });
});

it("can't change viewer role", async () => {
  const { container } = await createTestRenderer();

  const viewerRow = within(container).getByText(viewer.username!, {
    selector: "tr",
  });
  expect(() => within(viewerRow).getByLabelText("Change role")).toThrow();
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
  const { container } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByText(user.username!, {
    selector: "tr",
  });

  act(() => {
    within(userRow).getByLabelText("Change role").props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user role"
  );

  act(() => {
    within(popup).getByText("Staff", { selector: "button" }).props.onClick();
  });

  expect(resolvers.Mutation!.updateUserRole!.called).toBe(true);
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
  const { container } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByText(user.username!, {
    selector: "tr",
  });

  act(() => {
    within(userRow).getByLabelText("Change role").props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user role"
  );

  act(() => {
    within(popup)
      .getByText("Site Moderator", { selector: "button" })
      .props.onClick();
  });

  const modal = within(container).getByTestID("site-role-modal");

  // The submit button should be disabled until at least 1 site is selected
  expect(
    within(modal).getByTestID("site-role-modal-submitButton").props.disabled
  ).toBe(true);

  const siteSearchField = within(modal).getByTestID("site-search-textField");

  act(() =>
    siteSearchField.props.onChange({
      target: { value: "Test" },
    })
  );

  const siteSearchButton = within(modal).getByTestID("site-search-button");
  act(() => {
    siteSearchButton.props.onClick({ preventDefault: noop });
  });

  // Add site to add site moderator permissions for
  await act(async () => {
    await waitForElement(() => within(modal).getByTestID("site-search-list"));
    within(modal).getByText("Test Site").props.onClick();
  });

  await act(async () => {
    within(modal).getByType("form").props.onSubmit();
  });

  expect(resolvers.Mutation!.updateUserRole!.called).toBe(true);
  expect(resolvers.Mutation!.updateUserModerationScopes!.called).toBe(true);
});

it("can't change role as a moderator", async () => {
  const moderator = users.moderators[0];
  const { container } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        viewer: () => moderator,
      },
    }),
  });
  expect(() => within(container).getByLabelText("Change role")).toThrow();
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
      promoteUser: ({ variables }) => {
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
  const { container } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByText(user.username!, {
    selector: "tr",
  });

  act(() => {
    within(userRow).getByLabelText("Change role").props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to promote/demote a user to/from sites"
  );

  act(() => {
    within(popup)
      .getByText("Site Moderator", { selector: "button" })
      .props.onClick();
  });

  const modal = within(container).getByTestID("siteRoleActions-modal");

  await act(async () => {
    within(modal).getByType("form").props.onSubmit();
  });
  expect(resolvers.Mutation!.promoteUser!.called).toBe(true);
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
      demoteUser: ({ variables }) => {
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
  const { container } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByText(siteModeratorUser.username!, {
    selector: "tr",
  });

  act(() => {
    within(userRow).getByLabelText("Change role").props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to promote/demote a user to/from sites"
  );

  act(() => {
    within(popup)
      .getByText("Remove my sites", { selector: "button" })
      .props.onClick();
  });

  const modal = within(container).getByTestID("siteRoleActions-modal");

  await act(async () => {
    within(modal).getByType("form").props.onSubmit();
  });
  expect(resolvers.Mutation!.demoteUser!.called).toBe(true);
});

it("load more", async () => {
  const { container } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        users: ({ callCount }) => {
          switch (callCount) {
            case 0:
              return {
                edges: [
                  {
                    node: viewer,
                    cursor: viewer.createdAt,
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
  const loadMore = within(container).getByText("Load More");
  await act(async () => {
    loadMore.props.onClick();
    // Wait for load more to disappear.
    await waitUntilThrow(() => within(container).getByText("Load More"));
  });
  // Make sure third user was added.
  within(container).getByText(users.commenters[1].username!);
});

it("filter by search", async () => {
  const { container } = await createTestRenderer({
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

  const searchField = within(container).getByLabelText("Search by username", {
    exact: false,
  });
  const form = within(searchField).getParentByType("form");

  await act(async () => {
    searchField.props.onChange({
      target: { value: "search" },
    });
    form.props.onSubmit();
    await waitForElement(() =>
      within(container).getByText("could not find anyone", { exact: false })
    );
  });
});

it("filter by status", async () => {
  const { container } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        users: ({ variables, callCount }) => {
          switch (callCount) {
            case 0:
              return communityUsers;
            default:
              expectAndFail(variables.status).toBe("BANNED");
              return emptyCommunityUsers;
          }
        },
      },
    }),
  });

  const statusField = within(container).getByLabelText(
    "Search by user status",
    {
      exact: false,
    }
  );
  const bannedOption = within(statusField).getByText("Banned");

  await act(async () => {
    statusField.props.onChange({
      target: { value: bannedOption.props.value.toString() },
    });
    await waitForElement(() =>
      within(container).getByText("We could not find anyone", { exact: false })
    );
  });
});

it("can't change staff, moderator and admin status", async () => {
  const { container } = await createTestRenderer();
  ["Admin", "Moderator", "Staff"].forEach((role) => {
    const viewerRow = within(container).getAllByText(role, {
      selector: "tr",
    });
    expect(() =>
      within(viewerRow[0]).getByLabelText("Change user status")
    ).toThrow();
  });
});

it("suspend user", async () => {
  const user = users.commenters[0];

  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      suspendUser: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
        });
        const userRecord = pureMerge<typeof user>(user, {
          status: {
            current: user.status.current.concat(GQLUSER_STATUS.SUSPENDED),
            suspension: { active: true },
          },
        });
        return {
          user: userRecord,
        };
      },
    },
  });

  const { container, testRenderer } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByText(user.username!, {
    selector: "tr",
  });

  act(() => {
    within(userRow).getByLabelText("Change user status").props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  act(() => {
    within(popup).getByText("Suspend", { selector: "button" }).props.onClick();
  });

  const modal = within(testRenderer.root).getByLabelText("Suspend", {
    exact: false,
  });

  act(() => {
    within(modal).getByType("form").props.onSubmit();
  });
  within(userRow).getByText("Suspended");
  expect(resolvers.Mutation!.suspendUser!.called).toBe(true);
});

it("remove user suspension", async () => {
  const user = users.suspendedCommenter;
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      removeUserSuspension: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
        });
        const userRecord = pureMerge<typeof user>(user, {
          status: {
            current: [GQLUSER_STATUS.ACTIVE],
            suspension: { active: false },
          },
        });
        return {
          user: userRecord,
        };
      },
    },
    Query: {
      users: () => ({
        edges: [
          {
            node: user,
            cursor: user.createdAt,
          },
        ],
        pageInfo: { endCursor: null, hasNextPage: false },
      }),
    },
  });

  const { container } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByText(user.username!, {
    selector: "tr",
  });

  act(() => {
    within(userRow).getByLabelText("Change user status").props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  act(() => {
    within(popup)
      .getByText("Remove suspension", { selector: "button" })
      .props.onClick();
  });
  expect(resolvers.Mutation!.removeUserSuspension!.called).toBe(true);

  await waitForElement(() => within(userRow).getByText("Active"));
});

it("suspend user with custom timeout", async () => {
  const user = users.commenters[0];

  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      suspendUser: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
          timeout: 604800,
        });
        const userRecord = pureMerge<typeof user>(user, {
          status: {
            current: user.status.current.concat(GQLUSER_STATUS.SUSPENDED),
            suspension: { active: true },
          },
        });
        return {
          user: userRecord,
        };
      },
    },
  });

  const { container, testRenderer } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByText(user.username!, {
    selector: "tr",
  });

  act(() => {
    within(userRow).getByLabelText("Change user status").props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  act(() => {
    within(popup).getByText("Suspend", { selector: "button" }).props.onClick();
  });

  const modal = within(testRenderer.root).getByLabelText("Suspend", {
    exact: false,
  });

  const changedDuration = within(modal).getByID("duration-604800");

  act(() => {
    changedDuration.props.onChange(changedDuration.props.value.toString());
  });

  act(() => {
    within(modal).getByType("form").props.onSubmit();
  });
  within(userRow).getByText("Suspended");
  expect(resolvers.Mutation!.suspendUser!.called).toBe(true);
});

it("suspend user with custom message", async () => {
  const user = users.commenters[0];

  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      suspendUser: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
          message: "YOU WERE SUSPENDED FOR BEHAVING BADLY",
        });
        const userRecord = pureMerge<typeof user>(user, {
          status: {
            current: user.status.current.concat(GQLUSER_STATUS.SUSPENDED),
            suspension: { active: true },
          },
        });
        return {
          user: userRecord,
        };
      },
    },
  });

  const { container, testRenderer } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByText(user.username!, {
    selector: "tr",
  });

  act(() => {
    within(userRow).getByLabelText("Change user status").props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  act(() => {
    within(popup).getByText("Suspend", { selector: "button" }).props.onClick();
  });

  const modal = within(testRenderer.root).getByLabelText("Suspend", {
    exact: false,
  });

  const toggleEdit = within(modal).getByID("suspendModal-editMessage");

  act(() => {
    toggleEdit.props.onChange(true);
  });

  act(() => {
    within(modal)
      .getByID("suspendModal-message")
      .props.onChange("YOU WERE SUSPENDED FOR BEHAVING BADLY");
  });

  act(() => {
    within(modal).getByType("form").props.onSubmit();
  });

  within(userRow).getByText("Suspended");
  expect(resolvers.Mutation!.suspendUser!.called).toBe(true);
});

it("bans user from all sites", async () => {
  const user = users.commenters[0];

  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      banUser: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
        });
        const userRecord = pureMerge<typeof user>(user, {
          status: {
            current: user.status.current.concat(GQLUSER_STATUS.BANNED),
            ban: { active: true },
          },
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

  const { container, testRenderer } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByText(user.username!, {
    selector: "tr",
  });

  act(() => {
    within(userRow).getByLabelText("Change user status").props.onClick();
  });

  const dropdown = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  act(() => {
    within(dropdown)
      .getByText("Manage ban", { selector: "button", exact: false })
      .props.onClick();
  });

  const modal = within(testRenderer.root).getByLabelText(
    "Are you sure you want to ban",
    {
      exact: false,
    }
  );

  act(() => {
    within(modal).getByLabelText("All sites").props.onChange();
  });

  act(() => {
    within(modal).getByType("form").props.onSubmit();
  });
  within(userRow).getByText("Banned", { exact: false });
  expect(resolvers.Mutation!.banUser!.called).toBe(true);
});

it("ban user with custom message", async () => {
  const user = users.commenters[0];

  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      banUser: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
          message: "YOU WERE BANNED FOR BREAKING THE RULES",
        });
        const userRecord = pureMerge<typeof user>(user, {
          status: {
            current: user.status.current.concat(GQLUSER_STATUS.BANNED),
            ban: { active: true },
          },
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

  const { container, testRenderer } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByText(user.username!, {
    selector: "tr",
  });

  act(() => {
    within(userRow).getByLabelText("Change user status").props.onClick();
  });

  const dropdown = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  act(() => {
    within(dropdown)
      .getByText("Manage ban", { selector: "button", exact: false })
      .props.onClick();
  });

  const modal = within(testRenderer.root).getByLabelText(
    "Are you sure you want to ban",
    {
      exact: false,
    }
  );

  const toggleMessage = within(modal).getByID("banModal-showMessage");

  act(() => {
    toggleMessage.props.onChange({
      target: {
        checked: true,
      },
    });
  });

  act(() => {
    within(modal)
      .getByID("banModal-message")
      .props.onChange({
        target: {
          value: "YOU WERE BANNED FOR BREAKING THE RULES",
        },
      });
  });

  act(() => {
    within(modal).getByType("form").props.onSubmit();
  });
  within(userRow).getByText("Banned", { exact: false });
  expect(resolvers.Mutation!.banUser!.called).toBe(true);
});

it("remove user ban from all sites", async () => {
  const user = users.bannedCommenter;
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      removeUserBan: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
        });
        const userRecord = pureMerge<typeof user>(user, {
          status: {
            current: user.status.current.filter(
              (s) => s !== GQLUSER_STATUS.BANNED
            ),
            ban: { active: false },
          },
        });
        return {
          user: userRecord,
        };
      },
    },
    Query: {
      settings: () => settingsWithMultisite,
      users: () => ({
        edges: [
          {
            node: user,
            cursor: user.createdAt,
          },
        ],
        pageInfo: { endCursor: null, hasNextPage: false },
      }),
    },
  });

  const { container } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByText(user.username!, {
    selector: "tr",
  });

  act(() => {
    within(userRow).getByLabelText("Change user status").props.onClick();
  });

  const dropdown = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  act(() => {
    within(dropdown)
      .getByText("Manage Ban", { selector: "button", exact: false })
      .props.onClick();
  });

  const modal = within(userRow).getByLabelText(
    "Are you sure you want to unban",
    { exact: false }
  );

  act(() => {
    within(modal).getByLabelText("No sites", { exact: false }).props.onChange();
  });

  act(() => {
    within(modal).getByType("form").props.onSubmit();
  });

  within(userRow).getByText("Active");
  expect(resolvers.Mutation!.removeUserBan!.called).toBe(true);
});

it("send user a moderation message", async () => {
  const user = users.commenters[0];

  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      sendModMessage: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
          message:
            "Just wanted to send a friendly reminder about our comment guidelines.",
        });
        const userRecord = pureMerge<typeof user>(user, {
          status: {
            modMessage: { active: true },
          },
        });
        return {
          user: userRecord,
        };
      },
    },
  });

  const { container, testRenderer } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByText(user.username!, {
    selector: "tr",
  });

  act(() => {
    within(userRow).getByLabelText("Change user status").props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  act(() => {
    within(popup).getByText("Message", { selector: "button" }).props.onClick();
  });

  const modal = within(testRenderer.root).getByLabelText("Message", {
    exact: false,
  });

  act(() => {
    within(modal)
      .getByTestID("modMessageModal-message")
      .props.onChange(
        "Just wanted to send a friendly reminder about our comment guidelines."
      );
  });

  act(() => {
    within(modal).getByType("form").props.onSubmit();
  });
  // Sending the user a moderation message should not change their status
  within(userRow).getByText("Active");
  expect(resolvers.Mutation!.sendModMessage!.called).toBe(true);
});

it("invites user", async () => {
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      inviteUsers: ({ variables }) => ({
        invites: variables.emails.map((email, idx) => ({
          id: uuid(),
          email,
        })),
      }),
    },
  });
  const { container } = await createTestRenderer({ resolvers });

  // Find the invite button.
  const inviteButton = within(container).getByTestID("invite-users-button");

  // Let's click the button.
  act(() => inviteButton.props.onClick());

  // Find the form.
  const modal = within(container).getByTestID("invite-users-modal");
  const form = within(modal).getByType("form");

  // Find the first email field.
  const field = within(form).getByTestID("invite-users-email.0");

  // Submit the form.
  await act(async () => {
    field.props.onChange("test@email.com");
    return form.props.onSubmit();
  });

  await wait(() => {
    expect(resolvers.Mutation!.inviteUsers!.called).toBe(true);
  });
});

it("ban user across specific sites", async () => {
  const user = users.commenters[0];

  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      settings: () => settingsWithMultisite,
      site: ({ variables, callCount }) => {
        switch (callCount) {
          case 0:
            expectAndFail(variables.id).toBe("site-1");
            return sites[0];
          case 1:
            expectAndFail(variables.id).toBe("site-2");
            return sites[1];
          default:
            return siteConnection;
        }
      },
    },
    Mutation: {
      updateUserBan: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
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

  const { container, testRenderer } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByText(user.username!, {
    selector: "tr",
  });

  act(() => {
    within(userRow).getByLabelText("Change user status").props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  act(() => {
    within(popup)
      .getByText("Manage Ban", { selector: "button", exact: false })
      .props.onClick();
  });
  const modal = within(testRenderer.root).getByLabelText(
    "Are you sure you want to ban",
    {
      exact: false,
    }
  );

  act(() => {
    within(modal).getByLabelText("Specific sites").props.onChange();
  });

  const siteSearchField = within(modal).getByTestID("site-search-textField");

  act(() =>
    siteSearchField.props.onChange({
      target: { value: "Test" },
    })
  );

  const siteSearchButton = within(modal).getByTestID("site-search-button");
  act(() => {
    siteSearchButton.props.onClick({ preventDefault: noop });
  });

  // Add site to ban on
  await act(async () => {
    await waitForElement(() => within(modal).getByTestID("site-search-list"));
    within(modal).getByText("Test Site").props.onClick();
  });

  const testSiteCheckbox = within(modal).getAllByTestID(
    "user-status-selected-site"
  );
  expect(testSiteCheckbox).toHaveLength(1);
  expect(testSiteCheckbox[0].props.checked).toEqual(true);

  // Add another site to ban on
  act(() =>
    siteSearchField.props.onChange({
      target: { value: "Another" },
    })
  );

  act(() => {
    siteSearchButton.props.onClick({ preventDefault: noop });
  });

  await act(async () => {
    await waitForElement(() => within(modal).getByTestID("site-search-list"));
    within(modal).getByText("Second Site").props.onClick();
  });

  expect(
    within(modal).getAllByTestID("user-status-selected-site")
  ).toHaveLength(2);

  // Remove a site to ban on
  act(() => {
    within(modal)
      .getAllByTestID("user-status-selected-site")[0]
      .props.onChange();
  });

  // Submit ban and see that user is correctly banned across selected site
  await act(async () => {
    within(modal).getByType("form").props.onSubmit();
    await waitForElement(() => within(userRow).getByText("Banned (1)"));
  });

  expect(resolvers.Mutation!.updateUserBan!.called).toBe(true);
});
