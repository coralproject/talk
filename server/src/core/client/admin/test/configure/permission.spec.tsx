import { screen, waitFor } from "@testing-library/react";

import { pureMerge } from "coral-common/utils";
import { GQLResolver, GQLUSER_ROLE } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
import { settings, users } from "../fixtures";

beforeEach(() => {
  replaceHistoryLocation("http://localhost/admin/configure/general");
});

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
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
  customRenderAppWithContext(context);
}

it("denies access to moderators", async () => {
  const deniedRoles = [GQLUSER_ROLE.MODERATOR];
  for (const r of deniedRoles) {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          viewer: () => ({ ...viewer, role: r }),
        },
      }),
    });
    expect(
      await screen.findByText("Sign in with a different account")
    ).toBeVisible();
  }
});

it("allows access to admins", async () => {
  const deniedRoles = [GQLUSER_ROLE.ADMIN];
  for (const r of deniedRoles) {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          viewer: () => ({ ...viewer, role: r }),
        },
      }),
    });
    await waitFor(async () => {
      expect(await screen.findByTestId("configure-container")).toBeVisible();
    });
  }
});
