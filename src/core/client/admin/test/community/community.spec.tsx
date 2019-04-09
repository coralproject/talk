import { merge } from "lodash";
import TestRenderer from "react-test-renderer";

import {
  GQLUSER_ROLE,
  GQLUSER_STATUS,
  QueryToSettingsResolver,
  QueryToUsersResolver,
  QueryToViewerResolver,
} from "talk-framework/schema";
import {
  createMutationResolverStub,
  createQueryResolverStub,
  findParentWithType,
  replaceHistoryLocation,
  waitForElement,
  waitUntilThrow,
  within,
} from "talk-framework/testHelpers";

import {
  BanUserMutation,
  RemoveUserBanMutation,
  UpdateUserRoleMutation,
} from "talk-admin/mutations";
import create from "../create";
import {
  communityUsers,
  emptyCommunityUsers,
  settings,
  users,
} from "../fixtures";

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/community");
});

const createTestRenderer = async (resolver: any = {}) => {
  const resolvers = {
    ...resolver,
    Query: {
      settings: createQueryResolverStub<QueryToSettingsResolver>(
        () => settings
      ),
      users: createQueryResolverStub<QueryToUsersResolver>(variables => {
        expectAndFail(variables.role).toBeFalsy();
        return communityUsers;
      }),
      viewer: createQueryResolverStub<QueryToViewerResolver>(
        () => users.admins[0]
      ),
      ...resolver.Query,
    },
  };
  const { testRenderer } = create({
    // Set this to true, to see graphql responses.
    logNetwork: false,
    resolvers,
    initLocalState: localRecord => {
      localRecord.setValue(true, "loggedIn");
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
    Query: {
      users: createQueryResolverStub<QueryToUsersResolver>(
        () => emptyCommunityUsers
      ),
    },
  });
  expect(within(container).toJSON()).toMatchSnapshot();
});

it("filter by role", async () => {
  const { container } = await createTestRenderer({
    Query: {
      users: createQueryResolverStub<QueryToUsersResolver>(
        (variables, callCount) => {
          switch (callCount) {
            case 0:
              return communityUsers;
            default:
              expectAndFail(variables.role).toBe(GQLUSER_ROLE.COMMENTER);
              return emptyCommunityUsers;
          }
        }
      ),
    },
  });

  const selectField = within(container).getByLabelText("Search by role");
  const commentersOption = within(selectField).getByText("Commenters");

  TestRenderer.act(() => {
    selectField.props.onChange({
      target: { value: commentersOption.props.value.toString() },
    });
    // TODO: Fix act warnings until await Promise.resolve();
    // or whatever comes out at https://github.com/facebook/react/issues/14769
  });

  await waitForElement(() =>
    within(container).getByText("We could not find anyone", { exact: false })
  );
});

it("can't change viewer role", async () => {
  const viewer = users.admins[0];
  const { container } = await createTestRenderer();

  const viewerRow = within(container).getByText(viewer.username!, {
    selector: "tr",
  });
  expect(() => within(viewerRow).getByLabelText("Change role")).toThrow();
});

it("change user role", async () => {
  const user = users.commenters[0];
  const updateUserRole = createMutationResolverStub<
    typeof UpdateUserRoleMutation
  >(variables => {
    expectAndFail(variables).toMatchObject({
      userID: user.id,
      role: GQLUSER_ROLE.STAFF,
    });
    const userRecord = merge({}, user, { role: variables.role });
    return {
      user: userRecord,
    };
  });

  const { container } = await createTestRenderer({
    Mutation: { updateUserRole },
  });

  const userRow = within(container).getByText(user.username!, {
    selector: "tr",
  });

  TestRenderer.act(() => {
    within(userRow)
      .getByLabelText("Change role")
      .props.onClick();
  });

  const popup = within(userRow).getByLabelText(
    "A dropdown to change the user role"
  );

  TestRenderer.act(() => {
    within(popup)
      .getByText("Staff")
      .props.onClick();
  });

  within(userRow).getByText("Staff");
  expect(updateUserRole.called).toBe(true);
});

it("can't change role as a moderator", async () => {
  const viewer = users.moderators[0];
  const { container } = await createTestRenderer({
    Query: {
      viewer: createQueryResolverStub<QueryToViewerResolver>(() => viewer),
    },
  });
  expect(() => within(container).getByLabelText("Change role")).toThrow();
});

it("load more", async () => {
  const { container } = await createTestRenderer({
    Query: {
      users: createQueryResolverStub<QueryToUsersResolver>(
        (variables, callCount) => {
          switch (callCount) {
            case 0:
              return {
                edges: [
                  { node: users.admins[0], cursor: users.admins[0].createdAt },
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
        }
      ),
    },
  });
  const loadMore = within(container).getByText("Load More");
  TestRenderer.act(() => {
    loadMore.props.onClick();
  });

  // Wait for load more to disappear.
  await waitUntilThrow(() => within(container).getByText("Load More"));

  // Make sure third user was added.
  within(container).getByText(users.commenters[1].username!);
});

it("filter by search", async () => {
  const { container } = await createTestRenderer({
    Query: {
      users: createQueryResolverStub<QueryToUsersResolver>(
        (variables, callCount) => {
          switch (callCount) {
            case 0:
              return communityUsers;
            default:
              expectAndFail(variables.query).toBe("search");
              return emptyCommunityUsers;
          }
        }
      ),
    },
  });

  const searchField = within(container).getByLabelText("Search by username", {
    exact: false,
  });
  const form = findParentWithType(searchField, "form")!;

  TestRenderer.act(() => {
    searchField.props.onChange({
      target: { value: "search" },
    });
    form.props.onSubmit();
  });

  await waitForElement(() =>
    within(container).getByText("could not find anyone", { exact: false })
  );
});

it("filter by status", async () => {
  const { container } = await createTestRenderer({
    Query: {
      users: createQueryResolverStub<QueryToUsersResolver>(
        (variables, callCount) => {
          switch (callCount) {
            case 0:
              return communityUsers;
            default:
              expectAndFail(variables.status).toBe("BANNED");
              return emptyCommunityUsers;
          }
        }
      ),
    },
  });

  const statusField = within(container).getByLabelText(
    "Search by user status",
    {
      exact: false,
    }
  );
  const bannedOption = within(statusField).getByText("Banned");

  TestRenderer.act(() => {
    statusField.props.onChange({
      target: { value: bannedOption.props.value.toString() },
    });
    // TODO: Fix act warnings until await Promise.resolve();
    // or whatever comes out at https://github.com/facebook/react/issues/14769
  });

  await waitForElement(() =>
    within(container).getByText("We could not find anyone", { exact: false })
  );
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

it("ban user", async () => {
  const user = users.commenters[0];
  const banUser = createMutationResolverStub<typeof BanUserMutation>(
    variables => {
      expectAndFail(variables).toMatchObject({
        userID: user.id,
      });
      const userRecord = merge({}, user, {
        status: {
          current: user.status.current.concat(GQLUSER_STATUS.BANNED),
          banned: { active: true },
        },
      });
      return {
        user: userRecord,
      };
    }
  );

  const { container, testRenderer } = await createTestRenderer({
    Mutation: { banUser },
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
      .getByText("Ban User")
      .props.onClick();
  });

  const modal = within(testRenderer.root).getByLabelText(
    "Are you sure you want to ban",
    {
      exact: false,
    }
  );

  within(modal)
    .getByText("Ban User")
    .props.onClick();
  within(userRow).getByText("Banned");
  expect(banUser.called).toBe(true);
});

it("remove user ban", async () => {
  const user = users.bannedCommenter;
  const removeUserBan = createMutationResolverStub<
    typeof RemoveUserBanMutation
  >(variables => {
    expectAndFail(variables).toMatchObject({
      userID: user.id,
    });
    const userRecord = merge({}, user, {
      status: {
        current: user.status.current.filter(s => s !== GQLUSER_STATUS.BANNED),
        banned: { active: false },
      },
    });
    return {
      user: userRecord,
    };
  });

  const { container } = await createTestRenderer({
    Mutation: { removeUserBan },
    Query: {
      users: createQueryResolverStub<QueryToUsersResolver>(() => ({
        edges: [
          {
            node: user,
            cursor: user.createdAt,
          },
        ],
        pageInfo: { endCursor: null, hasNextPage: false },
      })),
    },
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
      .getByText("Remove Ban")
      .props.onClick();
  });

  within(userRow).getByText("Active");
  expect(removeUserBan.called).toBe(true);
});
