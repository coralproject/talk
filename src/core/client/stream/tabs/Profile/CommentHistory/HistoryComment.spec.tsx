import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import HistoryComment from "./HistoryComment";

const HistoryCommentN = removeFragmentRefs(HistoryComment);

it("renders correctly", () => {
  const props: PropTypesOf<typeof HistoryCommentN> = {
    id: "comment-id",
    body: "Hello World",
    createdAt: "2018-07-06T18:24:00.000Z",
    replyCount: 4,
    reactionCount: 0,
    reactionSettings: {
      label: "reaction",
      icon: "icon",
    },
    story: {
      metadata: {
        title: "Story Title",
      },
    },
    conversationURL: "http://localhost/conversation",
    onGotoConversation: noop,
  };
  const renderer = createRenderer();
  renderer.render(<HistoryCommentN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
