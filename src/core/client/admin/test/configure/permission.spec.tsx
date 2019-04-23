import { pureMerge } from "talk-common/utils";
import { GQLResolver, GQLUSER_ROLE } from "talk-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  waitForElement,
  within,
} from "talk-framework/testHelpers";

import create from "../create";
import { settings, users } from "../fixtures";

beforeEach(() => {
  replaceHistoryLocation("http://localhost/admin/configure/general");
});

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer } = create({
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
      localRecord.setValue(true, "loggedIn");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  return {
    testRenderer,
  };
}

it("denies access to moderators", async () => {
  const deniedRoles = [GQLUSER_ROLE.MODERATOR];
  for (const r of deniedRoles) {
    const { testRenderer } = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          viewer: () => ({ ...viewer, role: r }),
        },
      }),
    });
    await waitForElement(() =>
      within(testRenderer.root).getByText("Sign in with a different account")
    );
  }
});

it("allows access to admins", async () => {
  const deniedRoles = [GQLUSER_ROLE.ADMIN];
  for (const r of deniedRoles) {
    const { testRenderer } = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          viewer: () => ({ ...viewer, role: r }),
        },
      }),
    });
    await waitForElement(() =>
      within(testRenderer.root).getByTestID("configure-container")
    );
  }
});
