import { screen, within } from "@testing-library/react";
import { pureMerge } from "coral-common/utils";
import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";
import {
  commenters,
  settings,
  stories,
  storyWithReplies,
} from "coral-stream/test/fixtures";

import create from "../create";
import customRenderAppWithContext from "../customRenderAppWithContext";

async function createTestRenderer(
  params: CreateTestRendererParams<GQLResolver> = {}
) {
  const { context } = create({
    ...params,
    resolvers: pureMerge(
      createResolversStub<GQLResolver>({
        Query: {
          settings: () => settings,
          viewer: () => commenters[0],
          story: () => stories[0],
          stream: () => stories[0],
        },
      }),
      params.resolvers
    ),
    initLocalState: (localRecord, source, environment) => {
      localRecord.setValue(stories[0].id, "storyID");
      if (params.initLocalState) {
        params.initLocalState(localRecord, source, environment);
      }
    },
  });

  customRenderAppWithContext(context);

  const container = await screen.findByTestId("comments-allComments-log");

  return { container, context };
}

it("renders username and body", async () => {
  const { container } = await createTestRenderer();

  const firstComment = stories[0].comments.edges[0].node;
  const commentElement = await within(container).findByTestId(
    `comment-${firstComment.id}`
  );
  expect(commentElement).toBeDefined();
  expect(
    within(commentElement).getByText(firstComment.author!.username!)
  ).toBeDefined();
  expect(within(commentElement).getByText(firstComment.body!)).toBeDefined();
});

it("renders body only", async () => {
  const commentsWithNoUsernames: typeof stories[0] = {
    ...stories[0],
    comments: {
      ...stories[0].comments,
      edges: stories[0].comments.edges.map((edge) => ({
        ...edge,
        node: {
          ...edge.node,
          author: {
            ...edge.node.author,
            username: undefined,
          } as typeof edge.node.author,
        },
      })),
    },
  };
  const { container } = await createTestRenderer({
    resolvers: {
      Query: {
        story: () => commentsWithNoUsernames,
        stream: () => commentsWithNoUsernames,
      },
    },
  });

  const firstComment = commentsWithNoUsernames.comments.edges[0].node;
  const firstCommentAuthor = stories[0].comments.edges[0].node.author;
  const firstCommentElement = await within(container).findByTestId(
    `comment-${firstComment.id}`
  );
  expect(
    within(firstCommentElement).queryByText(firstCommentAuthor!.username!)
  ).toBeNull();

  expect(
    within(firstCommentElement).getByText(firstComment.body!)
  ).toBeDefined();
});

it("renders InReplyTo", async () => {
  const { container } = await createTestRenderer({
    resolvers: {
      Query: {
        story: () => storyWithReplies,
        stream: () => storyWithReplies,
      },
    },
  });

  const firstComment = storyWithReplies.comments.edges[1].node;
  const firstReply = firstComment.replies.edges[0].node;

  const firstReplyElement = await within(container).findByTestId(
    `comment-${firstReply.id}`
  );

  const inReplyTo = within(firstReplyElement).getByText((content, element) => {
    const match =
      content.startsWith("In reply") &&
      !!element &&
      element.innerHTML.includes(firstComment.author!.username!);
    return match;
  });

  expect(inReplyTo).toBeDefined();

  screen.debug(inReplyTo);
});

it("NEW renders disabled reply when story is closed", async () => {
  const closedStory = {
    ...stories[0],
    isClosed: true,
  };
  const { container } = await createTestRenderer({
    resolvers: {
      Query: {
        story: () => closedStory,
        stream: () => closedStory,
      },
    },
  });

  expect(container).toBeDefined();

  const commentIDs = closedStory.comments.edges.map(({ node }) => node.id);

  for (const commentID of commentIDs) {
    const commentElement = await within(container).findByTestId(
      `comment-${commentID}`
    );

    expect(commentElement).toBeDefined();
    const inReplyTo = within(commentElement).findByText("In reply");
    expect(inReplyTo).toBeDefined();
  }
});
