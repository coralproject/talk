import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { PROTECTED_EMAIL_DOMAINS } from "coral-common/common/lib/constants";
import { pureMerge } from "coral-common/common/lib/utils";
import {
  GQLNEW_USER_MODERATION,
  GQLResolver,
  GQLSettings,
  GQLUser,
  GQLUSER_ROLE,
  GQLUSER_STATUS,
} from "coral-framework/schema";

import { createContext } from "../test/create";
import customRenderAppWithContext from "../test/customRenderAppWithContext";

import {
  isOrgModerator,
  isSiteModerator,
} from "coral-common/common/lib/permissions/types";
import {
  communityUsers,
  settings,
  site,
  siteConnection,
  users,
} from "../test/fixtures";

const commenter = pureMerge(
  {
    email: `${users.commenters[0].username!}@test.com`,
  },
  users.commenters[0]
);

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const resolvers = createResolversStub<GQLResolver>({
    Query: {
      users: () => communityUsers,
      settings: () => settings,
      site: () => site,
      viewer: () => users.admins[0],
      sites: () => siteConnection,
    },
    Mutation: {
      createEmailDomain: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          domain: "test.com",
          newUserModeration: GQLNEW_USER_MODERATION.BAN,
        });
        return {};
      },
      updateUserBan: ({ variables }) => {
        return {};
      },
      banUser: ({ variables }) => {
        expectAndFail(variables).toMatchObject({
          userID: commenter.id,
        });
        const userRecord = pureMerge<typeof commenter>(commenter, {
          status: {
            current: commenter.status.current.concat(GQLUSER_STATUS.BANNED),
            ban: { active: true },
          },
        });
        return {
          user: userRecord,
        };
      },
    },
  });

  const { context } = createContext({
    ...params,
    resolvers: pureMerge(resolvers, params.resolvers),
    initLocalState: (localRecord, source, environmenet) => {},
  });

  customRenderAppWithContext(context);
  const container = await screen.findByTestId("community-container");
  return { container, resolvers };
}

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/community");
});
afterEach(jest.clearAllMocks);

const getUserRow = (container: HTMLElement, user: GQLUser): HTMLElement =>
  within(container).getByRole("row", {
    name: new RegExp(`^${user.username}`),
  });

const getBanModal = (container: HTMLElement, user: GQLUser) => {
  const userRow = getUserRow(container, user);
  userEvent.click(
    within(userRow).getByRole("button", { name: "Change user status" })
  );

  const dropdown = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );
  fireEvent.click(within(dropdown).getByRole("button", { name: "Manage Ban" }));

  const modal = screen.getByLabelText(
    `Are you sure you want to ban ${user.username}?`
  );

  return modal;
};

it("creates domain ban for unmoderated domain while updating user ban status", async () => {
  const { container, resolvers } = await createTestRenderer();

  const user = communityUsers.edges.find(
    (edge) => edge.node.role === GQLUSER_ROLE.COMMENTER
  )!.node;

  const userRow = getUserRow(container, user);
  userEvent.click(
    within(userRow).getByRole("button", { name: "Change user status" })
  );

  const dropdown = within(userRow).getByLabelText(
    "A dropdown to change the user status"
  );
  fireEvent.click(within(dropdown).getByRole("button", { name: "Manage Ban" }));

  const modal = getBanModal(container, user);

  const banDomainButton = within(modal).getByLabelText(
    `Ban all new commenter accounts from test.com`
  );
  userEvent.click(banDomainButton);
  screen.debug(banDomainButton);
  userEvent.click(within(modal).getByRole("button", { name: "Ban" }));

  await waitFor(() =>
    expect(resolvers.Mutation!.createEmailDomain!.called).toBeTruthy()
  );

  expect(within(userRow).getByText("Banned")).toBeVisible();
  expect(resolvers.Mutation!.banUser!.called).toBe(true);
  expect(resolvers.Mutation!.createEmailDomain!.called).toBeTruthy();
});

const orgMods = users.moderators.filter((user) => isOrgModerator(user));
const gteOrgMods = [...orgMods, ...users.admins];

test.each(gteOrgMods)(
  "shows ban domain option for admins and org mods",
  async (gteOrgMod) => {
    const { container } = await createTestRenderer({
      resolvers: {
        Query: {
          viewer: () => gteOrgMod,
        },
      },
    });

    const commenterUser = communityUsers.edges.find(
      ({ node }) => node.role === GQLUSER_ROLE.COMMENTER
    )!.node;

    const modal = getBanModal(container, commenterUser);

    const banDomainButton = within(modal).getByLabelText(
      `Ban all new commenter accounts from test.com`
    );

    expect(banDomainButton).toBeInTheDocument();
  }
);

const siteMods = users.moderators.filter((user) => isSiteModerator(user));
test.each(siteMods)(
  "does not show ban domain option to site mods",
  async (siteMod) => {
    const { container } = await createTestRenderer({
      resolvers: {
        Query: {
          viewer: () => siteMod,
        },
      },
    });

    const commenterUser = communityUsers.edges.find(
      ({ node }) => node.role === GQLUSER_ROLE.COMMENTER
    )!.node;

    const modal = getBanModal(container, commenterUser);

    const banDomainButton = within(modal).queryByText(
      `Ban all new commenter accounts from test.com`
    );

    expect(banDomainButton).toBeNull();
  }
);

it("does not display ban domain option for moderated domain", async () => {
  const user = communityUsers.edges.find(
    (edge) => edge.node.role === GQLUSER_ROLE.COMMENTER
  )!.node;
  const moderatedSettings: GQLSettings = {
    ...settings,
    emailDomainModeration: [
      {
        id: "test-id",
        domain: "test.com",
        newUserModeration: GQLNEW_USER_MODERATION.BAN,
      },
    ],
  };

  const moderatedResolvers = createResolversStub<GQLResolver>({
    Query: {
      settings: () => moderatedSettings,
    },
  });

  const { container } = await createTestRenderer({
    resolvers: moderatedResolvers,
  });

  const modal = getBanModal(container, user);

  const banDomainButton = within(modal).queryByText(
    `Ban all new commenter accounts from test.com`
  );

  expect(banDomainButton).not.toBeInTheDocument();
});

test.each([...PROTECTED_EMAIL_DOMAINS.values()])(
  "does not display ban domain option for protected domains",
  async (domain) => {
    const protectedEmailResolvers = createResolversStub<GQLResolver>({
      Query: {
        users: () => ({
          ...communityUsers,
          edges: communityUsers.edges
            .filter((edge) => edge.node.role !== GQLUSER_ROLE.ADMIN)
            .map((edge) => ({
              ...edge,
              node: { ...edge.node, email: `${edge.node.username}@${domain}` },
            })),
        }),
      },
    });

    const { container } = await createTestRenderer({
      resolvers: protectedEmailResolvers,
    });

    const user = communityUsers.edges.find(
      ({ node }) => node.role === GQLUSER_ROLE.COMMENTER
    )!.node;

    const userRow = getUserRow(container, user);

    userEvent.click(
      within(userRow).getByRole("button", { name: "Change user status" })
    );

    const dropdown = within(userRow).getByLabelText(
      "A dropdown to change the user status"
    );
    fireEvent.click(
      within(dropdown).getByRole("button", { name: "Manage Ban" })
    );
    const modal = getBanModal(container, user);

    const banDomainButton = within(modal).queryByText(
      `Ban all new commenter accounts from test.com`
    );

    expect(banDomainButton).not.toBeInTheDocument();
  }
);
