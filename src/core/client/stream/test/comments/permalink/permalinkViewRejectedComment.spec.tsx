import { screen } from "@testing-library/react";

import customRenderAppWithContext from "coral-stream/test/customRenderAppWithContext";

import {
  commentWithRejectedReply,
  replyableComment,
  settings,
  stories,
  unrepliableComment,
} from "../../fixtures";
import create from "./create";

const story = stories[0];

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

  customRenderAppWithContext(context);
};

it("allows replies to comments with canReply = true", async () => {
  await createTestRenderer();

  const shouldBeEnabled = await screen.findByLabelText(
    `Reply to comment by ${replyableComment.author?.username}`,
    { exact: false }
  );
  expect(shouldBeEnabled).toBeEnabled();
});

it("disallows replies to comments with canReply = false", async () => {
  await createTestRenderer();

  const shouldBeDisabled = await screen.findByLabelText(
    `Reply to comment by ${unrepliableComment.author?.username}`,
    { exact: false }
  );

  expect(shouldBeDisabled).toBeDisabled();
});
