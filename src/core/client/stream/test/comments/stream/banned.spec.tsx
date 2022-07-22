import timekeeper from "timekeeper";

import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";
import {
  createComment,
  createComments,
  createStory,
  createUser,
  createUserStatus,
} from "coral-test/helpers/fixture";

import { settings } from "../../fixtures";
import create from "./create";

const bannedUser = createUser();
bannedUser.status = createUserStatus(true);

const story = createStory({ comments: createComments(3) });
const firstComment = story.comments.edges[0].node;
const reactedComment = createComment();

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => bannedUser,
          stream: () =>
            pureMerge<typeof story>(story, {
              comments: {
                edges: [
                  ...story.comments.edges,
                  {
                    node: pureMerge<typeof reactedComment>(reactedComment, {
                      actionCounts: { reaction: { total: 1 } },
                    }),
                    cursor: reactedComment.createdAt,
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
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );
  within(tabPane).getAllByText("Your account has been banned", {
    exact: false,
  });

  expect(within(tabPane).queryByTestID("comment-reply-button")).toBeNull();
  expect(within(tabPane).queryByTestID("comment-report-button")).toBeNull();
  expect(within(tabPane).queryByTestID("comment-edit-button")).toBeNull();
  expect(
    within(tabPane).getByTestID("comment-reaction-button").props.disabled
  ).toBe(true);
});
