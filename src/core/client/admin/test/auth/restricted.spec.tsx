import sinon from "sinon";

import { pureMerge } from "coral-common/utils";
import { LOCAL_ID, lookup } from "coral-framework/lib/relay";
import { GQLResolver, GQLUSER_ROLE } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  wait,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  settings,
  siteConnection,
  users,
} from "../fixtures";

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  replaceHistoryLocation("http://localhost/admin/moderate/reported");
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          moderationQueues: () => emptyModerationQueues,
          comments: () => emptyRejectedComments,
          viewer: () => viewer,
          sites: () => siteConnection,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue("SIGN_IN", "authView");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  return { testRenderer, context };
}

it("show restricted screen for commenters and staff", async () => {
  const restrictedRoles = [GQLUSER_ROLE.COMMENTER, GQLUSER_ROLE.STAFF];
  for (const role of restrictedRoles) {
    const { testRenderer } = await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          viewer: () =>
            pureMerge<typeof viewer>(viewer, {
              role,
            }),
        },
      }),
    });
    const authBox = await waitForElement(() =>
      within(testRenderer.root).getByTestID("authBox")
    );
    expect(within(authBox).toJSON()).toMatchSnapshot();
  }
});

it("sign out when clicking on sign in as", async () => {
  const { testRenderer, context } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        viewer: () =>
          pureMerge<typeof viewer>(viewer, {
            role: GQLUSER_ROLE.COMMENTER,
          }),
      },
    }),
  });
  const authBox = await waitForElement(() =>
    within(testRenderer.root).getByTestID("authBox")
  );

  const restMock = sinon.mock(context.rest);
  restMock
    .expects("fetch")
    .withArgs("/auth", {
      method: "DELETE",
    })
    .once()
    .returns({});

  within(authBox).getByText("Sign in with a different account").props.onClick();

  await wait(() => {
    expect(lookup(context.relayEnvironment, LOCAL_ID)!.redirectPath).toBe(
      "/admin/moderate/reported"
    );
  });
  restMock.verify();
});
