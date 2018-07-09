import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";
import sinon from "sinon";

import ReplyList from "./ReplyList";

it("renders correctly", () => {
  const props = {
    commentID: "comment-id",
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    onLoadMore: noop,
    hasMore: false,
  };
  const wrapper = shallow(<ReplyList {...props} />);
  expect(wrapper).toMatchSnapshot();
});

describe("when there is more", () => {
  const props = {
    commentID: "comment-id",
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    onLoadMore: sinon.spy(),
    hasMore: true,
  };

  const wrapper = shallow(<ReplyList {...props} />);
  it("renders a load more button", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("calls onLoadMore", () => {
    wrapper.find("#talk-reply-list--show-all--comment-id").simulate("click");
    expect(props.onLoadMore.calledOnce).toBe(true);
  });
});
