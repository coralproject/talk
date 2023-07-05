import { waitFor } from "@testing-library/react";

import { pureMerge } from "coral-common/utils";
import { LOCAL_ID, lookup } from "coral-framework/lib/relay";
import {
  GQLResolver,
  QueryToModerationQueuesResolver,
} from "coral-framework/schema";
import {
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import { createContext } from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";
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
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          sites: () => siteConnection,
          moderationQueues:
            createQueryResolverStub<QueryToModerationQueuesResolver>(
              () => emptyModerationQueues
            ),
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
  customRenderAppWithContext(context);
  return { context };
}

it("redirect when not logged in", async () => {
  const { context } = await createTestRenderer();
  await waitFor(() => {
    expect(lookup(context.relayEnvironment, LOCAL_ID)!.redirectPath).toBe(
      "/admin/moderate"
    );
    expect(window.location.toString()).toBe("http://localhost/admin/login");
  });
});
