import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
} from "coral-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  settings,
  stories,
  users,
} from "../fixtures";

const viewer = users.admins[0];

beforeEach(async () => {
  replaceHistoryLocation("http://localhost/admin/moderate");
});

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context, subscriptionHandler } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
          moderationQueues: () => emptyModerationQueues,
          comments: () => emptyRejectedComments,
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
  return { testRenderer, context, subscriptionHandler };
}

it("passes storyID to the endpoints", async () => {
  replaceHistoryLocation(`http://localhost/admin/moderate/${stories[0].id}`);
  await act(async () => {
    await createTestRenderer({
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          moderationQueues: ({ variables }) => {
            expectAndFail(variables.storyID).toBe(stories[0].id);
            return emptyModerationQueues;
          },
          comments: ({ variables }) => {
            expectAndFail(variables.storyID).toBe(stories[0].id);
            return emptyRejectedComments;
          },
        },
      }),
    });
  });
});
