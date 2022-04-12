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
  siteConnection,
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
