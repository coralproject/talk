import { screen } from "@testing-library/react";

import { pureMerge } from "coral-common/utils";
import {
  GQLCOMMENT_SORT,
  GQLResolver,
  StoryToCommentsResolver,
} from "coral-framework/schema";
import {
  createQueryResolverStub,
  createResolversStub,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";
import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";

import {
  settingsWithAlternateOldestFirstView,
  storyWithAnsweredComments,
  viewerWithComments,
} from "../../fixtures";
import { createContext } from "./create";

const story = storyWithAnsweredComments;

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = createContext({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          viewer: () => viewerWithComments,
          settings: () => settingsWithAlternateOldestFirstView,
          stream: () => ({
            ...story,
            featuredComments: createQueryResolverStub<StoryToCommentsResolver>(
              () => {
                return story.comments;
              }
            ) as any,
          }),
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
  customRenderAppWithContext(context);
  return {
    context,
  };
}

it("renders comment stream with answered comments", async () => {
  await createTestRenderer();
  const answeredComments = await screen.findByTestId(
    "comments-featuredComments-log"
  );
  expect(answeredComments).toBeVisible();
  expect(
    screen.getByRole("tab", { name: "Tab: Answered ( 2 )" })
  ).toBeVisible();
  expect(
    screen.getByRole("article", {
      name: "Answer from Markus 2018-07-06T18:24:00.000Z",
    })
  ).toBeVisible();
  expect(
    screen.getByRole("article", {
      name: "Answer from Lukas 2018-07-06T18:24:00.000Z",
    })
  ).toBeVisible();
});

it("renders oldest first sort answered comments tab with post comment form", async () => {
  await createTestRenderer({
    initLocalState: (localRecord) => {
      localRecord.setValue(GQLCOMMENT_SORT.CREATED_AT_ASC, "commentsOrderBy");
    },
  });
  const answeredComments = await screen.findByTestId(
    "comments-featuredComments-log"
  );
  expect(answeredComments).toBeVisible();
  expect(
    screen.getByRole("tab", { name: "Tab: Answered ( 2 )" })
  ).toBeVisible();
  expect(
    screen.getByRole("article", {
      name: "Answer from Markus 2018-07-06T18:24:00.000Z",
    })
  ).toBeVisible();
  expect(
    screen.getByRole("article", {
      name: "Answer from Lukas 2018-07-06T18:24:00.000Z",
    })
  ).toBeVisible();
  expect(
    await screen.findByRole("region", { name: "Post a Question" })
  ).toBeVisible();
});
