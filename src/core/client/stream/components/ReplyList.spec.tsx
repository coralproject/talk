import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";
import sinon, { SinonSpy } from "sinon";

import ReplyList, { ReplyListProps } from "./ReplyList";

it("renders correctly", () => {
  const props: ReplyListProps = {
    commentID: "comment-id",
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    onShowAll: noop,
    hasMore: false,
    disableShowAll: false,
  };
  const wrapper = shallow(<ReplyList {...props} />);
  expect(wrapper).toMatchSnapshot();
});

describe("when there is more", () => {
  const props: ReplyListProps = {
    commentID: "comment-id",
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    onShowAll: sinon.spy(),
    hasMore: true,
    disableShowAll: false,
  };

  const wrapper = shallow(<ReplyList {...props} />);
  it("renders a load more button", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("calls onLoadMore", () => {
    wrapper
      .find("#talk-comments-replyList-showAll--comment-id")
      .simulate("click");
    expect((props.onShowAll as SinonSpy).calledOnce).toBe(true);
  });
});
