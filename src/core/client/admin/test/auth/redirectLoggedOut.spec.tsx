import { GQLLocal } from "coral-admin/schema";
import { pureMerge } from "coral-common/utils";
import { lookupLocal } from "coral-framework/lib/relay";
import {
  act,
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  wait,
} from "coral-framework/testHelpers";
import {
  GQLResolver,
  QueryToModerationQueuesResolver,
} from "coral-framework/testHelpers/schema";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  settings,
  siteConnection,
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
          sites: () => siteConnection,
          moderationQueues: createQueryResolverStub<
            QueryToModerationQueuesResolver
          >(() => emptyModerationQueues),
          comments: () => emptyRejectedComments,
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

it("redirect when not logged in", async () => {
  const { context } = await createTestRenderer();
  await act(async () => {
    await wait(() => {
      expect(lookupLocal<GQLLocal>(context.relayEnvironment).redirectPath).toBe(
        "/admin/moderate"
      );
      expect(window.location.toString()).toBe("http://localhost/admin/login");
    });
  });
});
