import { render, screen, within } from "@testing-library/react";
import React from "react";

import {
  CoralContext,
  CoralContextProvider,
} from "coral-framework/lib/bootstrap";
import { AppContainer } from "coral-stream/App";

import create from "./create";

import {
  commentWithRejectedReply,
  replyableComment,
  settings,
  stories,
  unreplyableComment,
} from "../../fixtures";

const story = stories[0];

function customRenderWithContext(context: CoralContext) {
  render(
    <CoralContextProvider value={context}>
      <AppContainer disableListeners />
    </CoralContextProvider>
  );
}

const createTestRenderer = async () => {
  const resolvers = {
    Query: {
      comment: () => commentWithRejectedReply,
      settings: () => settings,
      story: () => story,
    },
  };

  const { context } = create({
    resolvers,
    initLocalState: (localRecord) => {
      localRecord.setValue(story.id, "storyID");
      localRecord.setValue(commentWithRejectedReply.id, "commentID");
    },
  });

  customRenderWithContext(context);

  const enabledComment = await screen.findByTestId(
    `comment-${replyableComment.id}`
  );
  const disabledComment = await screen.findByTestId(
    `comment-${unreplyableComment.id}`
  );

  return {
    replyableComment: enabledComment,
    unreplyableComment: disabledComment,
  };
};

it("allows replies to comments with canReply = true", async () => {
  const {
    replyableComment: replyableCommentElement,
  } = await createTestRenderer();

  const replyButton = await within(replyableCommentElement).findByTestId(
    "comment-reply-button"
  );
  expect(replyButton).toBeEnabled();
});

it("disallows replies to comments with canReply = false", async () => {
  const {
    unreplyableComment: unreplyableCommentElement,
  } = await createTestRenderer();

  const replyButton = await within(unreplyableCommentElement).findByTestId(
    "comment-reply-button"
  );
  expect(replyButton).toBeDisabled();
});
