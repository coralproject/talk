import { pureMerge } from "coral-common/utils";
import { GQLResolver, GQLStory } from "coral-framework/schema";
import {
  act,
  createResolversStub,
  CreateTestRendererParams,
  waitForElement,
  within,
} from "coral-framework/testHelpers";

import {
  commenters,
  moderators,
  settings,
  stories,
  storyWithOnlyStaffComments,
  viewerPassive,
} from "../../fixtures";
import create from "../create";

const viewer = viewerPassive;

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {},
  story: GQLStory
) {
  const { testRenderer, context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => viewer,
          stream: () => story,
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

it("ignore user", async () => {
  const firstComment = stories[0].comments.edges[0].node;
  const firstCommentAuthor = stories[0].comments.edges[0].node.author!;
  const { testRenderer, tabPane } = await createTestRenderer(
    {
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
    },
    stories[0]
  );
  const comment = await waitForElement(() =>
    within(testRenderer.root).getByTestID(`comment-${firstComment.id}`)
  );
  const username = within(comment).getByText(firstCommentAuthor.username!, {
    selector: "button",
  });
  act(() => {
    username.props.onClick();
  });
  const ignoreButton = within(comment).getByText("Ignore", {
    selector: "button",
  });
  act(() => {
    ignoreButton.props.onClick();
  });
  within(comment).getByText("Cancel", {
    selector: "button",
  });
  await act(async () => {
    within(comment)
      .getByText("Ignore", {
        selector: "button",
      })
      .props.onClick();
    // Check for a tombstone
    await waitForElement(() =>
      within(tabPane).getByText(
        "This comment is hidden because you ignored this user."
      )
    );
  });
});

it("render stream with ignored user", async () => {
  const firstComment = stories[0].comments.edges[0].node;
  const firstCommentAuthor = stories[0].comments.edges[0].node.author!;
  const { testRenderer, tabPane } = await createTestRenderer(
    {
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          viewer: () =>
            pureMerge<typeof viewer>(viewer, {
              ignoredUsers: [firstCommentAuthor],
            }),
        },
      }),
    },
    stories[0]
  );
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );
  expect(
    within(tabPane).queryByTestID(`comment-${firstComment.id}`)
  ).toBeNull();
});

it("render stream with only staff comments, ignore user button should not be present", async () => {
  const { testRenderer, tabPane } = await createTestRenderer(
    {
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          viewer: () =>
            pureMerge<typeof viewer>(viewer, {
              ignoredUsers: [],
            }),
        },
      }),
    },
    storyWithOnlyStaffComments
  );
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );
  const moderator = moderators[0];
  const username = within(tabPane).getByText(moderator.username!, {
    selector: "button",
  });

  // Click on the staff member's username to
  // reveal the user pop over
  act(() => {
    username.props.onClick();
  });

  // Staff members cannot be ignored, expect the
  // ignore button to be missing
  expect(within(tabPane).queryByText("Ignore")).toBeNull();
});

it("render stream with regular comments, ignore user button should be present", async () => {
  const { testRenderer, tabPane } = await createTestRenderer(
    {
      resolvers: createResolversStub<GQLResolver>({
        Query: {
          viewer: () =>
            pureMerge<typeof viewer>(viewer, {
              ignoredUsers: [],
            }),
        },
      }),
    },
    stories[0]
  );
  await waitForElement(() =>
    within(testRenderer.root).getByTestID("comments-allComments-log")
  );

  const commenter = commenters[0];
  const username = within(tabPane).getByText(commenter.username!, {
    selector: "button",
  });

  // Click on the user's name to
  // reveal the user pop over
  act(() => {
    username.props.onClick();
  });

  // Regular members can be ignored, expect the
  // ignore button to be present
  expect(within(tabPane).queryByText("Ignore")).toBeDefined();
});
