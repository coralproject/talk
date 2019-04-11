import {
  GQLResolver,
  QueryToModerationQueuesResolver,
} from "talk-framework/schema";
import {
  createAccessToken,
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  wait,
} from "talk-framework/testHelpers";

import { pureMerge } from "talk-common/utils";
import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  settings,
  users,
} from "../fixtures";

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  replaceHistoryLocation("http://localhost/admin/login");
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          moderationQueues: createQueryResolverStub<
            QueryToModerationQueuesResolver
          >(() => emptyModerationQueues),
          comments: () => emptyRejectedComments,
          viewer: () => viewer,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(true, "loggedIn");
      localRecord.setValue(createAccessToken(), "accessToken");
      localRecord.setValue("SIGN_IN", "authView");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  return { testRenderer, context };
}

it("redirect when already logged in", async () => {
  await createTestRenderer();
  await wait(() =>
    expect(window.location.toString()).toBe(
      "http://localhost/admin/moderate/reported"
    )
  );
});

it("redirect to redirectPath when already logged in", async () => {
  await createTestRenderer({
    initLocalState: localRecord => {
      localRecord.setValue("/admin/moderate/pending", "redirectPath");
    },
  });
  await wait(() =>
    expect(window.location.toString()).toBe(
      "http://localhost/admin/moderate/pending"
    )
  );
});
