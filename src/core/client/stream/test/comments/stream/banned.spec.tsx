import timekeeper from "timekeeper";

import { pureMerge } from "coral-common/utils";
import { GQLResolver, GQLUSER_STATUS } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { comments, settings, stories } from "../../fixtures";
import create from "./create";

const story = stories[0];
const firstComment = story.comments.edges[0].node;
const viewer = firstComment.author!;

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () =>
            pureMerge<typeof viewer>(viewer, {
              status: {
                current: [GQLUSER_STATUS.BANNED],
              },
            }),
          story: () =>
            pureMerge<typeof story>(story, {
              comments: {
                edges: [
                  ...story.comments.edges,
                  {
                    node: pureMerge<typeof comments[2]>(comments[2], {
                      actionCounts: { reaction: { total: 1 } },
                    }),
                    cursor: comments[2].createdAt,
                  },
                ],
              },
            }),
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(story.id, "storyID");
      localRecord.setValue(true, "loggedIn");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });

  const tabPane = await waitForElement(() =>
    within(testRenderer.root).getByTestID("current-tab-pane")
  );

  return {
    testRenderer,
    context,
    tabPane,
  };
}

afterAll(() => {
  timekeeper.reset();
});

it("disables comment stream", async () => {
  timekeeper.freeze(firstComment.createdAt);
  const { testRenderer, tabPane } = await createTestRenderer();
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-stream-log")
  );
  within(tabPane).getAllByText("Your account has been banned", {
    exact: false,
  });
  expect(
    within(tabPane).queryByText("Reply", { selector: "button" })
  ).toBeNull();
  expect(
    within(tabPane).queryByText("Report", { selector: "button" })
  ).toBeNull();
  expect(
    within(tabPane).queryByText("Edit", { selector: "button" })
  ).toBeNull();
  expect(
    within(tabPane).getByText("Respect", { selector: "button" }).props.disabled
  ).toBe(true);
});
