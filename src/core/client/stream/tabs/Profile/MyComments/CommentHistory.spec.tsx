import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { DEFAULT_AUTO_ARCHIVE_OLDER_THAN } from "coral-common/constants";
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
    archivingEnabled: false,
    autoArchiveOlderThanMs: DEFAULT_AUTO_ARCHIVE_OLDER_THAN,
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
      archivingEnabled: false,
      autoArchiveOlderThanMs: DEFAULT_AUTO_ARCHIVE_OLDER_THAN,
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
      archivingEnabled: false,
      autoArchiveOlderThanMs: DEFAULT_AUTO_ARCHIVE_OLDER_THAN,
    };
    const renderer = createRenderer();
    renderer.render(<CommentHistoryN {...props} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
