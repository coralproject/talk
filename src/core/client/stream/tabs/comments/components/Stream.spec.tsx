import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";
import sinon, { SinonSpy } from "sinon";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import Stream from "./Stream";

const StreamN = removeFragmentRefs(Stream);

it("renders correctly", () => {
  const props: PropTypesOf<typeof StreamN> = {
    story: {
      id: "story-id",
      isClosed: false,
    },
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    settings: { reaction: { sortLabel: "Most Reacted" } },
    onLoadMore: noop,
    disableLoadMore: false,
    hasMore: false,
    viewer: null,
    orderBy: "CREATED_AT_ASC",
    onChangeOrderBy: noop,
  };
  const wrapper = shallow(<StreamN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

describe("when use is logged in", () => {
  it("renders correctly", () => {
    const props: PropTypesOf<typeof StreamN> = {
      story: {
        id: "story-id",
        isClosed: false,
      },
      comments: [{ id: "comment-1" }, { id: "comment-2" }],
      onLoadMore: noop,
      disableLoadMore: false,
      hasMore: false,
      viewer: {},
      settings: { reaction: { sortLabel: "Most Reacted" } },
      orderBy: "CREATED_AT_ASC",
      onChangeOrderBy: noop,
    };
    const wrapper = shallow(<StreamN {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe("when there is more", () => {
  const props: PropTypesOf<typeof StreamN> = {
    story: {
      id: "story-id",
      isClosed: false,
    },
    comments: [{ id: "comment-1" }, { id: "comment-2" }],
    settings: { reaction: { sortLabel: "Most Reacted" } },
    onLoadMore: sinon.spy(),
    disableLoadMore: false,
    hasMore: true,
    viewer: null,
    orderBy: "CREATED_AT_ASC",
    onChangeOrderBy: noop,
  };

  const wrapper = shallow(<StreamN {...props} />);
  it("renders a load more button", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("calls onLoadMore", () => {
    wrapper.find("#talk-comments-stream-loadMore").simulate("click");
    expect((props.onLoadMore as SinonSpy).calledOnce).toBe(true);
  });

  const wrapperDisabledButton = shallow(<StreamN {...props} disableLoadMore />);
  it("disables load more button", () => {
    expect(wrapperDisabledButton).toMatchSnapshot();
  });
});
