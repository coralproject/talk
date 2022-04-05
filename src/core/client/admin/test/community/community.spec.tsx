import { noop } from "lodash";
import { v1 as uuid } from "uuid";

import { pureMerge } from "coral-common/utils";
import { GQLResolver, GQLUSER_STATUS } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import {
  communityUsers,
  emptyCommunityUsers,
  settings,
  settingsWithMultisite,
  siteConnection,
  sites,
  users,
} from "../fixtures";

const adminViewer = users.admins[0];

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
  const container = await waitForElement(() =>
    within(testRenderer.root).getByTestID("community-container")
  );
  return { testRenderer, container };
};

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
