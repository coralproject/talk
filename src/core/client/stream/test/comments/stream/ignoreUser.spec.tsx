import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import { settings, stories, viewerPassive } from "../../fixtures";
import create from "../create";

const story = stories[0];
const firstComment = story.comments.edges[0].node;
const firstCommentAuthor = story.comments.edges[0].node.author!;
const viewer = viewerPassive;

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
          story: () => story,
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

it("ignore user", async () => {
  const { testRenderer, tabPane } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Mutation: {
        ignoreUser: ({ variables }) => {
          expectAndFail(variables).toMatchObject({
            userID: firstCommentAuthor.id,
          });
          return {};
        },
      },
    }),
  });
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${firstComment.id}`)
  );
  const username = within(comment).getByText(firstCommentAuthor.username!, {
    selector: "button",
  });
  username.props.onClick();
  const ignoreButton = within(comment).getByText("Ignore", {
    selector: "button",
  });
  ignoreButton.props.onClick();
  within(comment).getByText("Cancel", {
    selector: "button",
  });
  within(comment)
    .getByText("Ignore", {
      selector: "button",
    })
    .props.onClick();
  // Check for a tombstone
  await waitForElement(() =>
    within(tabPane).getByText("This comment is hidden", { exact: false })
  );
});

it("render stream with ignored user", async () => {
  const { testRenderer, tabPane } = await createTestRenderer({
    resolvers: createResolversStub<GQLResolver>({
      Query: {
        viewer: () =>
          pureMerge<typeof viewer>(viewer, {
            ignoredUsers: [firstCommentAuthor],
          }),
      },
    }),
  });
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-stream-log")
  );
  expect(
    within(tabPane).queryByTestID(`comment-${firstComment.id}`)
  ).toBeNull();
});
