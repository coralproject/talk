import TestRenderer from "react-test-renderer";
import uuid from "uuid/v1";

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
    within(container)
      .getByTestID("invite-users-button")
      .props.onClick()
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
    within(userRow)
      .getByLabelText("Change role")
      .props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user role"
  );

  act(() => {
    within(popup)
      .getByText("Staff", { selector: "button" })
      .props.onClick();
  });

  within(userRow).getByText("Staff");
  expect(resolvers.Mutation!.updateUserRole!.called).toBe(true);
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
  ["Admin", "Moderator", "Staff"].forEach(role => {
    const viewerRow = within(container).getByText(role, {
      selector: "tr",
    });
    expect(() =>
      within(viewerRow).getByLabelText("Change user status")
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

  TestRenderer.act(() => {
    within(userRow)
      .getByLabelText("Change user status")
      .props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  TestRenderer.act(() => {
    within(popup)
      .getByText("Suspend", { selector: "button" })
      .props.onClick();
  });

  const modal = within(testRenderer.root).getByLabelText("Suspend", {
    exact: false,
  });

  TestRenderer.act(() => {
    within(modal)
      .getByType("form")
      .props.onSubmit();
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

  TestRenderer.act(() => {
    within(userRow)
      .getByLabelText("Change user status")
      .props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  TestRenderer.act(() => {
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

  TestRenderer.act(() => {
    within(userRow)
      .getByLabelText("Change user status")
      .props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  TestRenderer.act(() => {
    within(popup)
      .getByText("Suspend", { selector: "button" })
      .props.onClick();
  });

  const modal = within(testRenderer.root).getByLabelText("Suspend", {
    exact: false,
  });

  const changedDuration = within(modal).getByID("duration-604800");

  TestRenderer.act(() => {
    changedDuration.props.onChange(changedDuration.props.value.toString());
  });

  TestRenderer.act(() => {
    within(modal)
      .getByType("form")
      .props.onSubmit();
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

  TestRenderer.act(() => {
    within(userRow)
      .getByLabelText("Change user status")
      .props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  TestRenderer.act(() => {
    within(popup)
      .getByText("Suspend", { selector: "button" })
      .props.onClick();
  });

  const modal = within(testRenderer.root).getByLabelText("Suspend", {
    exact: false,
  });

  const toggleEdit = within(modal).getByID("suspendModal-editMessage");

  TestRenderer.act(() => {
    toggleEdit.props.onChange(true);
  });

  TestRenderer.act(() => {
    within(modal)
      .getByID("suspendModal-message")
      .props.onChange("YOU WERE SUSPENDED FOR BEHAVING BADLY");
  });

  TestRenderer.act(() => {
    within(modal)
      .getByType("form")
      .props.onSubmit();
  });

  within(userRow).getByText("Suspended");
  expect(resolvers.Mutation!.suspendUser!.called).toBe(true);
});

it("ban user", async () => {
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
  });

  const { container, testRenderer } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByText(user.username!, {
    selector: "tr",
  });

  TestRenderer.act(() => {
    within(userRow)
      .getByLabelText("Change user status")
      .props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  TestRenderer.act(() => {
    within(popup)
      .getByText("Ban", { selector: "button" })
      .props.onClick();
  });

  const modal = within(testRenderer.root).getByLabelText(
    "Are you sure you want to ban",
    {
      exact: false,
    }
  );

  TestRenderer.act(() => {
    within(modal)
      .getByType("form")
      .props.onSubmit();
  });
  within(userRow).getByText("Banned");
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
  });

  const { container, testRenderer } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByText(user.username!, {
    selector: "tr",
  });

  TestRenderer.act(() => {
    within(userRow)
      .getByLabelText("Change user status")
      .props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  TestRenderer.act(() => {
    within(popup)
      .getByText("Ban", { selector: "button" })
      .props.onClick();
  });

  const modal = within(testRenderer.root).getByLabelText(
    "Are you sure you want to ban",
    {
      exact: false,
    }
  );

  const toggleMessage = within(modal).getByID("banModal-showMessage");

  TestRenderer.act(() => {
    toggleMessage.props.onChange(true);
  });

  TestRenderer.act(() => {
    within(modal)
      .getByID("banModal-message")
      .props.onChange("YOU WERE BANNED FOR BREAKING THE RULES");
  });

  TestRenderer.act(() => {
    within(modal)
      .getByType("form")
      .props.onSubmit();
  });
  within(userRow).getByText("Banned");
  expect(resolvers.Mutation!.banUser!.called).toBe(true);
});

it("remove user ban", async () => {
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
              s => s !== GQLUSER_STATUS.BANNED
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

  TestRenderer.act(() => {
    within(userRow)
      .getByLabelText("Change user status")
      .props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );

  TestRenderer.act(() => {
    within(popup)
      .getByText("Remove ban", { selector: "button" })
      .props.onClick();
  });

  within(userRow).getByText("Active");
  expect(resolvers.Mutation!.removeUserBan!.called).toBe(true);
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
