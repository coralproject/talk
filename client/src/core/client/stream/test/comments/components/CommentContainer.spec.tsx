import { screen, waitFor, within } from "@testing-library/react";

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

  // it is usually best practice to use findByTestId
  // for async work.
  //
  // source: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#using-waitfor-to-wait-for-elements-that-can-be-queried-with-find
  //
  // however, for some special occasions, the test runner
  // has a hard time and doing a .getByTestId is more
  // performant. Since this cuts the `render username and body`
  // test from 1.32s down to 795ms on my machine, I'm doing
  // a waitFor + getByTestId here.
  return { context };
}

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
  await createTestRenderer({
    resolvers: {
      Query: {
        story: () => commentsWithNoUsernames,
        stream: () => commentsWithNoUsernames,
      },
    },
  });

  const container = await waitFor(() =>
    screen.getByTestId("comments-allComments-log")
  );

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
  await createTestRenderer({
    resolvers: {
      Query: {
        story: () => storyWithReplies,
        stream: () => storyWithReplies,
      },
    },
  });

  const container = await waitFor(() =>
    screen.getByTestId("comments-allComments-log")
  );

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

it("renders with tombstone when comment has been deleted", async () => {
  const storyFixture = storyWithDeletedComments;
  await createTestRenderer({
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

  const container = await waitFor(() =>
    screen.getByTestId("comments-allComments-log")
  );

  expect(container).toBeInTheDocument();

  const tombstone = within(container).getByText(
    "This comment is no longer available. The commenter has deleted their account.",
    { exact: false }
  );
  expect(tombstone).toBeInTheDocument();
});
