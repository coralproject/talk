import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";
import sinon from "sinon";

import Stream from "./Stream";

it("renders correctly", () => {
  const props = {
    id: "asset-id",
    isClosed: false,
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    onLoadMore: noop,
    hasMore: false,
  };
  const wrapper = shallow(<Stream {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders when comments is null", () => {
  const props = {
    id: "asset-id",
    isClosed: false,
    comments: null,
    onLoadMore: noop,
    hasMore: false,
  };
  const wrapper = shallow(<Stream {...props} />);
  expect(wrapper).toMatchSnapshot();
});

describe("when there is more", () => {
  const props = {
    id: "asset-id",
    isClosed: false,
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    onLoadMore: sinon.spy(),
    hasMore: true,
  };

  const wrapper = shallow(<Stream {...props} />);
  it("renders a load more button", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("calls onLoadMore", () => {
    wrapper.find(".talk-stream--loadmore").simulate("click");
    expect(props.onLoadMore.calledOnce).toBe(true);
  });
});
