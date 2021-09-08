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
    rating: null,
    media: null,
    story: {
      metadata: {
        title: "Story Title",
      },
      settings: {
        mode: "COMMENTS",
      },
    },
    footer: null,
    parent: {
      id: "parent-id",
      author: {
        username: "parent author",
      },
    },
  };
  const renderer = createRenderer();
  renderer.render(<HistoryCommentN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
