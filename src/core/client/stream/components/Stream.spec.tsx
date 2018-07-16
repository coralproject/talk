import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";
import sinon, { SinonSpy } from "sinon";

import { PropTypesOf } from "talk-framework/types";

import Stream from "./Stream";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Stream> = {
    assetID: "asset-id",
    isClosed: false,
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    onLoadMore: noop,
    disableLoadMore: false,
    hasMore: false,
  };
  const wrapper = shallow(<Stream {...props} />);
  expect(wrapper).toMatchSnapshot();
});

describe("when there is more", () => {
  const props: PropTypesOf<typeof Stream> = {
    assetID: "asset-id",
    isClosed: false,
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    onLoadMore: sinon.spy(),
    disableLoadMore: false,
    hasMore: true,
  };

  const wrapper = shallow(<Stream {...props} />);
  it("renders a load more button", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("calls onLoadMore", () => {
    wrapper.find("#talk-comments-stream-loadMore").simulate("click");
    expect((props.onLoadMore as SinonSpy).calledOnce).toBe(true);
  });

  const wrapperDisabledButton = shallow(<Stream {...props} disableLoadMore />);
  it("disables load more button", () => {
    expect(wrapperDisabledButton).toMatchSnapshot();
  });
});
