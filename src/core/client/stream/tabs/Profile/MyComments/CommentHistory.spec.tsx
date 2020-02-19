import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import CommentHistory from "./CommentHistory";

const CommentHistoryN = removeFragmentRefs(CommentHistory);

it("renders correctly", () => {
  const props: PropTypesOf<typeof CommentHistoryN> = {
    story: {},
    settings: {},
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    onLoadMore: noop,
    hasMore: false,
    disableLoadMore: false,
  };
  const renderer = createRenderer();
  renderer.render(<CommentHistoryN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

describe("has more", () => {
  it("renders correctly", () => {
    const props: PropTypesOf<typeof CommentHistoryN> = {
      story: {},
      settings: {},
      comments: [{ id: "comment-1" }, { id: "comment-2" }],
      onLoadMore: noop,
      hasMore: true,
      disableLoadMore: false,
    };
    const renderer = createRenderer();
    renderer.render(<CommentHistoryN {...props} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("disables load more", () => {
    const props: PropTypesOf<typeof CommentHistoryN> = {
      story: {},
      settings: {},
      comments: [{ id: "comment-1" }, { id: "comment-2" }],
      onLoadMore: noop,
      hasMore: true,
      disableLoadMore: true,
    };
    const renderer = createRenderer();
    renderer.render(<CommentHistoryN {...props} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
