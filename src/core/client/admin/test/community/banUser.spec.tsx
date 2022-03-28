import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { pureMerge } from "coral-common/utils";
import { GQLResolver, GQLUSER_STATUS } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
import {
  communityUsers,
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
  const { context } = createContext({
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
  customRenderAppWithContext(context);
  const container = await screen.findByTestId("community-container");
  return { container };
};

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

  const { container } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByRole("row", {
    name: "Isabelle isabelle@test.com 07/06/18, 06:24 PM Commenter Active",
  });
  userEvent.click(
    within(userRow).getByRole("button", { name: "Change user status" })
  );

  const dropdown = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );
  fireEvent.click(within(dropdown).getByRole("button", { name: "Manage Ban" }));

  const modal = screen.getByLabelText("Are you sure you want to ban Isabelle?");
  userEvent.click(within(modal).getByLabelText("All sites"));
  userEvent.click(within(modal).getByRole("button", { name: "Save" }));
  expect(within(userRow).getByText("Banned (all)")).toBeVisible();
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

  const { container } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByRole("row", {
    name: "Isabelle isabelle@test.com 07/06/18, 06:24 PM Commenter Active",
  });
  userEvent.click(
    within(userRow).getByRole("button", { name: "Change user status" })
  );
  const dropdown = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );
  fireEvent.click(within(dropdown).getByRole("button", { name: "Manage Ban" }));

  const modal = screen.getByLabelText("Are you sure you want to ban Isabelle?");
  const toggleMessage = within(modal).getByRole("checkbox", {
    name: "Customize ban email message",
  });
  userEvent.click(toggleMessage);

  // Add custom ban message and save
  const banModalMessage = within(modal).getByRole("textbox");
  userEvent.clear(banModalMessage);
  userEvent.type(banModalMessage, "YOU WERE BANNED FOR BREAKING THE RULES");
  userEvent.click(within(modal).getByRole("button", { name: "Save" }));

  expect(within(userRow).getByText("Banned (all)")).toBeVisible();
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

  const userRow = within(container).getByRole("row", {
    name: "Ingrid ingrid@test.com 07/06/18, 06:24 PM Commenter Banned (all)",
  });
  userEvent.click(
    within(userRow).getByRole("button", { name: "Change user status" })
  );
  const dropdown = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );
  fireEvent.click(within(dropdown).getByRole("button", { name: "Manage Ban" }));

  const modal = screen.getByLabelText("Are you sure you want to unban Ingrid?");
  userEvent.click(within(modal).getByLabelText("No sites"));
  userEvent.click(within(modal).getByRole("button", { name: "Save" }));

  expect(within(userRow).getByText("Active")).toBeVisible();
  expect(resolvers.Mutation!.removeUserBan!.called).toBe(true);
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

  const { container } = await createTestRenderer({
    resolvers,
  });

  const userRow = within(container).getByRole("row", {
    name: "Isabelle isabelle@test.com 07/06/18, 06:24 PM Commenter Active",
  });
  userEvent.click(
    within(userRow).getByRole("button", { name: "Change user status" })
  );
  const dropdown = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );
  fireEvent.click(within(dropdown).getByRole("button", { name: "Manage Ban" }));
  const modal = screen.getByLabelText("Are you sure you want to ban Isabelle?");
  userEvent.click(within(modal).getByLabelText("Specific sites"));

  // Add site to ban on
  const siteSearchTextbox = within(modal).getByRole("textbox", {
    name: "Search by site name",
  });
  userEvent.type(siteSearchTextbox, "Test");
  const siteSearchButton = within(modal).getByRole("button", {
    name: "Search",
  });
  userEvent.click(siteSearchButton);
  await within(modal).findByTestId("site-search-list");
  userEvent.click(within(modal).getByText("Test Site"));
  const testSiteCheckbox = await within(modal).findAllByTestId(
    "user-status-selected-site"
  );
  expect(testSiteCheckbox).toHaveLength(1);
  expect(testSiteCheckbox[0]).toBeChecked();

  // Add another site to ban on
  userEvent.clear(siteSearchTextbox);
  userEvent.type(siteSearchTextbox, "Second");
  userEvent.click(siteSearchButton);
  await within(modal).findByTestId("site-search-list");
  userEvent.click(within(modal).getByText("Second Site"));

  // have to wait for the Second Site selection to load in
  await within(modal).findAllByText("Second Site");
  expect(
    within(modal).getAllByTestId("user-status-selected-site")
  ).toHaveLength(2);

  // Remove a site to ban on
  userEvent.click(within(modal).getByRole("checkbox", { name: "Test Site" }));

  // Submit ban and see that user is correctly banned across selected site
  userEvent.click(within(modal).getByRole("button", { name: "Save" }));
  expect(await within(userRow).findByText("Banned (1)")).toBeVisible();
  expect(resolvers.Mutation!.updateUserBan!.called).toBe(true);
});

it("site moderators can unban users on their sites but not sites out of their scope", async () => {
  const user = users.siteBannedCommenter;
  const resolvers = createResolversStub<GQLResolver>({
    Mutation: {
      updateUserBan: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: user.id,
          banSiteIDs: [],
          unbanSiteIDs: ["site-1"],
        });
        const userRecord = pureMerge<typeof user>(user, {
          status: {
            ban: { active: false, sites: [sites[1]] },
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
      viewer: () => users.moderators[1],
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
  });

  const { container } = await createTestRenderer({
    resolvers,
  });
  const userRow = within(container).getByRole("row", {
    name: "Lulu lulu@test.com 07/06/18, 06:24 PM Commenter Banned (2)",
  });
  userEvent.click(
    within(userRow).getByRole("button", { name: "Change user status" })
  );
  const dropdown = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );
  fireEvent.click(within(dropdown).getByRole("button", { name: "Manage Ban" }));
  const modal = screen.getByLabelText(
    "Are you sure you want to manage the ban status of Lulu?"
  );
  const siteOneCheckbox = await within(modal).findByRole("checkbox", {
    name: "Test Site",
  });
  const siteTwoCheckbox = await within(modal).findByRole("checkbox", {
    name: "Second Site",
  });

  // Checkbox for site within moderator's scope is not disabled, but site out of scope is disabled
  expect(siteOneCheckbox).not.toBeDisabled();
  expect(siteTwoCheckbox).toBeDisabled();

  // When site mod unchecks site within their scope, the ban is removed for that site
  userEvent.click(siteOneCheckbox);
  userEvent.click(within(modal).getByRole("button", { name: "Save" }));
  expect(await within(userRow).findByText("Banned (1)")).toBeVisible();
  expect(resolvers.Mutation!.updateUserBan!.called).toBe(true);
});
