import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import CommentHistory from "./CommentHistory";

const CommentHistoryN = removeFragmentRefs(CommentHistory);

it("renders correctly", () => {
  const props: PropTypesOf<typeof CommentHistoryN> = {
    asset: {},
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    onLoadMore: noop,
    hasMore: false,
    disableLoadMore: false,
  };
  const wrapper = shallow(<CommentHistoryN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

describe("has more", () => {
  it("renders correctly", () => {
    const props: PropTypesOf<typeof CommentHistoryN> = {
      asset: {},
      comments: [{ id: "comment-1" }, { id: "comment-2" }],
      onLoadMore: noop,
      hasMore: true,
      disableLoadMore: false,
    };
    const wrapper = shallow(<CommentHistoryN {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
  it("disables load more", () => {
    const props: PropTypesOf<typeof CommentHistoryN> = {
      asset: {},
      comments: [{ id: "comment-1" }, { id: "comment-2" }],
      onLoadMore: noop,
      hasMore: true,
      disableLoadMore: true,
    };
    const wrapper = shallow(<CommentHistoryN {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
