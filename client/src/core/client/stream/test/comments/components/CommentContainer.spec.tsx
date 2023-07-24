import { screen, within } from "@testing-library/react";
import { pureMerge } from "coral-common/common/lib/utils";

import { GQLResolver } from "coral-framework/schema";
import {
  createResolversStub,
  CreateTestRendererParams,
} from "coral-framework/testHelpers";
import {
  commenters,
  settings,
  stories,
  storyWithDeletedComments,
  storyWithReplies,
} from "coral-stream/test/fixtures";

import customRenderAppWithContext from "../../customRenderAppWithContext";
import create from "../create";

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

afterEach(jest.clearAllMocks);

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
});

it("renders disabled reply when commenting has been disabled site-wide", async () => {
  const disabledComentingSettings = {
    ...settings,
    disableCommenting: {
      enabled: true,
      message: "Commenting has been disabled",
    },
  };
  const { container } = await createTestRenderer({
    resolvers: {
      Query: {
        settings: () => disabledComentingSettings,
      },
    },
  });

  const firstComment = stories[0].comments.edges[0].node;
  const firstCommentElement = within(container).getByTestId(
    `comment-${firstComment.id}`
  );

  expect(firstCommentElement).toBeInTheDocument();
  const replyButton = within(firstCommentElement).getByLabelText("Reply", {
    exact: false,
  });
  expect(replyButton).toBeInTheDocument();
  expect(replyButton).toBeDisabled();
});

it("renders disabled reply when story is closed", async () => {
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

  const firstComment = stories[0].comments.edges[0].node;
  const firstCommentElement = within(container).getByTestId(
    `comment-${firstComment.id}`
  );

  expect(firstCommentElement).toBeInTheDocument();
  const replyButton = within(firstCommentElement).getByLabelText("Reply", {
    exact: false,
  });
  expect(replyButton).toBeInTheDocument();
  expect(replyButton).toBeDisabled();
});

it("renders with tombstone when comment has been deleted", async () => {
  const storyFixture = storyWithDeletedComments;
  const { container } = await createTestRenderer({
    resolvers: {
      Query: {
        story: () => storyFixture,
        stream: () => storyFixture,
      },
    },
    initLocalState: (localStorage) => {
      localStorage.setValue(storyFixture.id, "storyID");
    },
  });

  expect(container).toBeInTheDocument();

  const tombstone = within(container).getByText(
    "This comment is no longer available. The commenter has deleted their account.",
    { exact: false }
  );
  expect(tombstone).toBeInTheDocument();
});
