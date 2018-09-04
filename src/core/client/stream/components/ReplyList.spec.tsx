import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";
import sinon, { SinonSpy } from "sinon";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import ReplyList from "./ReplyList";

const ReplyListN = removeFragmentRefs(ReplyList);

it("renders correctly", () => {
  const props: PropTypesOf<typeof ReplyListN> = {
    asset: { id: "asset-id" },
    comment: { id: "comment-id" },
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    onShowAll: noop,
    hasMore: false,
    disableShowAll: false,
    indentLevel: 1,
  };
  const wrapper = shallow(<ReplyListN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

describe("when there is more", () => {
  const props: PropTypesOf<typeof ReplyListN> = {
    asset: { id: "asset-id" },
    comment: { id: "comment-id" },
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    onShowAll: sinon.spy(),
    hasMore: true,
    disableShowAll: false,
    indentLevel: 1,
  };

  const wrapper = shallow(<ReplyListN {...props} />);
  it("renders a load more button", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("calls onLoadMore", () => {
    wrapper
      .find("#talk-comments-replyList-showAll--comment-id")
      .simulate("click");
    expect((props.onShowAll as SinonSpy).calledOnce).toBe(true);
  });

  const wrapperDisabledButton = shallow(
    <ReplyListN {...props} disableShowAll />
  );
  it("disables load more button", () => {
    expect(wrapperDisabledButton).toMatchSnapshot();
  });
});
