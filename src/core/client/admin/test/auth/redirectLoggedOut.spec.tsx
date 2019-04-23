import { pureMerge } from "talk-common/utils";
import { LOCAL_ID, lookup } from "talk-framework/lib/relay";
import {
  GQLResolver,
  QueryToModerationQueuesResolver,
} from "talk-framework/schema";
import {
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  wait,
} from "talk-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  settings,
} from "../fixtures";

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  replaceHistoryLocation("http://localhost/admin/moderate");
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
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(false, "loggedIn");
      localRecord.setValue("SIGN_IN", "authView");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  return { testRenderer, context };
}

it("redirect when not logged in", async () => {
  const { context } = await createTestRenderer();
  await wait(() => {
    expect(lookup(context.relayEnvironment, LOCAL_ID)!.redirectPath).toBe(
      "/admin/moderate/reported"
    );
    expect(window.location.toString()).toBe("http://localhost/admin/login");
  });
});
