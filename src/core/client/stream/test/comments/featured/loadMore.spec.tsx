import { pureMerge } from "coral-common/utils";
import { GQLResolver, StoryToCommentsResolver } from "coral-framework/schema";
import {
  act,
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  waitUntilThrow,
  within,
} from "coral-framework/testHelpers";

import { settings, storyWithFeaturedComments } from "../../fixtures";
import create from "./create";

const story = storyWithFeaturedComments;

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const storyResolver = () => ({
    ...story,
    featuredComments: createQueryResolverStub<StoryToCommentsResolver>(
      ({ variables }) => {
        if (!variables.after) {
          return {
            edges: [story.comments.edges[0]],
            pageInfo: {
              endCursor: story.comments.edges[0].cursor,
              hasNextPage: true,
            },
          };
        }
        expectAndFail(variables.after).toBe(story.comments.edges[0].cursor);
        return {
          edges: [story.comments.edges[1]],
          pageInfo: {
            endCursor: story.comments.edges[1].cursor,
            hasNextPage: false,
          },
        };
      }
    ) as any,
  });

  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          story: storyResolver,
          stream: storyResolver,
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(story.id, "storyID");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
  return {
    testRenderer,
    context,
  };
}

it("loads more", async () => {
  const { testRenderer } = await createTestRenderer();
  const streamLog = await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-featuredComments-log")
  );

  // Get amount of comments before.
  const commentsBefore =
    within(streamLog).getAllByTestID(/^featuredComment-/).length;

  const loadMoreButton = await waitForElement(() =>
    within(streamLog).getByText("Load More", {
      exact: false,
      selector: "button",
    })
  );
  await act(async () => {
    loadMoreButton.props.onClick({});
    await waitUntilThrow(() =>
      within(streamLog).getByText("Load More", {
        exact: false,
        selector: "button",
      })
    );
  });
  // Get amount of comments after.
  const commentsAfter =
    within(streamLog).getAllByTestID(/^featuredComment-/).length;
  expect(commentsAfter).toBeGreaterThan(commentsBefore);
});
