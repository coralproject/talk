import TestRenderer from "react-test-renderer";

import { pureMerge } from "coral-common/utils";
import {
  GQLResolver,
  GQLUSER_ROLE,
  GQLUSER_STATUS,
  QueryToUsersResolver,
} from "coral-framework/schema";
import {
  act,
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  findParentWithType,
  replaceHistoryLocation,
  waitForElement,
  waitUntilThrow,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import {
  communityUsers,
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
  const form = findParentWithType(searchField, "form")!;

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
      .getByText("Ban User", { selector: "button" })
      .props.onClick();
  });

  const modal = within(testRenderer.root).getByLabelText(
    "Are you sure you want to ban",
    {
      exact: false,
    }
  );

  expect(within(modal).toJSON()).toMatchSnapshot();

  TestRenderer.act(() => {
    within(modal)
      .getByText("Ban User")
      .props.onClick();
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
      .getByText("Remove Ban", { selector: "button" })
      .props.onClick();
  });

  within(userRow).getByText("Active");
  expect(resolvers.Mutation!.removeUserBan!.called).toBe(true);
});
