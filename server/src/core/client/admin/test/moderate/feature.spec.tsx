import { pureMerge } from "coral-common/utils";
import {
  GQLResolver,
  ModerationQueueToCommentsResolver,
  QueryToCommentResolver,
} from "coral-framework/schema";
import {
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  replaceHistoryLocation,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import create from "../create";
import {
  emptyModerationQueues,
  emptyRejectedComments,
  featuredComments,
  settings,
  site,
  siteConnection,
  unmoderatedComments,
  users,
} from "../fixtures";

const viewer = users.admins[0];

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
          moderationQueues: () => emptyModerationQueues,
          comments: () => emptyRejectedComments,
          site: () => site,
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
  return { testRenderer, context };
}

it("unmoderated and unfeatured comments available, feature button is present", async () => {
  replaceHistoryLocation("http://localhost/admin/moderate/unmoderated");
  const { testRenderer } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        moderationQueues: () =>
          pureMerge(emptyModerationQueues, {
            unmoderated: {
              count: 1,
              comments:
                createQueryResolverStub<ModerationQueueToCommentsResolver>(
                  () => {
                    return {
                      edges: [
                        {
                          node: unmoderatedComments[0],
                          cursor: unmoderatedComments[0].createdAt,
                        },
                      ],
                      pageInfo: {
                        endCursor: unmoderatedComments[0].createdAt,
                        hasNextPage: false,
                      },
                    };
                  }
                ),
            },
          }),
      },
    }),
  });
  const { getByTestID } = within(testRenderer.root);
  const moderateContainer = await waitForElement(() =>
    getByTestID("moderate-container")
  );
  const featureButton = within(moderateContainer).getByText("feature", {
    exact: false,
    selector: "button",
  });

  expect(featureButton).toBeDefined();
});

it("featured comment single view, featured button is present", async () => {
  const comment = featuredComments[0];
  const commentStub = createQueryResolverStub<QueryToCommentResolver>(
    ({ variables }) => {
      expectAndFail(variables).toEqual({ id: comment.id });
      return featuredComments[0];
    }
  );

  replaceHistoryLocation(
    `http://localhost/admin/moderate/comment/${featuredComments[0].id}`
  );
  const { testRenderer } = await createTestRenderer({
    resolvers: {
      Query: {
        comment: commentStub,
      },
    },
  });
  const { getByTestID } = within(testRenderer.root);
  const container = await waitForElement(() =>
    getByTestID("single-moderate-container")
  );
  const featuredButton = within(container).getByText("featured", {
    exact: false,
    selector: "button",
  });

  expect(featuredButton).toBeDefined();
});
