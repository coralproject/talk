import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { pureMerge } from "coral-common/utils";
import { GQLFEATURE_FLAG, GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
import { communityUsers, settings, siteConnection, users } from "../fixtures";

const viewer = users.admins[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/community");
});

const createTestRenderer = async (
  params: CreateTestRendererParams<GQLResolver> = {},
  settingsOverride?: any
) => {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => (settingsOverride ? settingsOverride : settings),
          users: ({ variables }) => {
            expectAndFail(variables.role).toBeFalsy();
            return communityUsers;
          },
          user: () => users.commenters[0],
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
  return { context };
};

it("user drawer is open and user name is visible", async () => {
  const { context } = await createTestRenderer();
  customRenderAppWithContext(context);
  await screen.findByTestId("community-container");
  const isabelle = screen.getByRole("button", { name: "Isabelle" });
  userEvent.click(isabelle);
  const isabelleUserHistory = await screen.findByTestId(
    "userHistoryDrawer-modal"
  );
  expect(
    within(isabelleUserHistory).queryByText("Isabelle")
  ).toBeInTheDocument();
});

it("opens user drawer and shows external profile url link when has feature flag and configured", async () => {
  const settingsOverride = settings;
  settingsOverride.featureFlags = [
    GQLFEATURE_FLAG.CONFIGURE_PUBLIC_PROFILE_URL,
  ];
  settingsOverride.externalProfileURL = "https://example.com/users/$USER_NAME";
  const { context } = await createTestRenderer({}, settingsOverride);
  customRenderAppWithContext(context);

  await screen.findByTestId("community-container");
  const isabelle = screen.getByRole("button", { name: "Isabelle" });
  userEvent.click(isabelle);

  const isabelleUserHistory = await screen.findByTestId(
    "userHistoryDrawer-modal"
  );
  const externalProfileURLLink = await within(isabelleUserHistory).findByRole(
    "link"
  );

  // has correct href and set up to open external profile url link in new tab
  expect(externalProfileURLLink).toHaveAttribute(
    "href",
    "https://example.com/users/Isabelle"
  );
  expect(externalProfileURLLink).toHaveAttribute("target", "_blank");
});

it("opens user drawer and does not show external profile url link when doesn't have feature flag", async () => {
  const settingsOverride = settings;
  settingsOverride.externalProfileURL = "https://example.com/users/$USER_NAME";
  const { context } = await createTestRenderer({}, settingsOverride);
  customRenderAppWithContext(context);

  await screen.findByTestId("community-container");
  const isabelle = screen.getByRole("button", { name: "Isabelle" });
  userEvent.click(isabelle);

  const isabelleUserHistory = await screen.findByTestId(
    "userHistoryDrawer-modal"
  );
  expect(within(isabelleUserHistory).queryByRole("link")).toBeNull();
});
