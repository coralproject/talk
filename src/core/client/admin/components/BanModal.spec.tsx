import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { pureMerge } from "coral-common/utils";
import {
  GQLNEW_USER_MODERATION,
  GQLResolver,
  GQLSettings,
  GQLUSER_STATUS,
} from "coral-framework/schema";

import { createContext } from "../test/create";
import customRenderAppWithContext from "../test/customRenderAppWithContext";

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

it("creates domain ban for unmoderated domain while updating user ban status", async () => {
  const { container, resolvers } = await createTestRenderer();

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

  const banDomainButton = within(modal).getByLabelText(
    `Ban all new accounts on test.com`
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

it("does not display ban domain option for moderated domain", async () => {
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

  const banDomainButton = within(modal).queryByText(
    `Ban all new accounts on test.com`
  );

  expect(banDomainButton).not.toBeInTheDocument();
});
