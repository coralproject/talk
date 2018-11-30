import { shallow } from "enzyme";
import { noop } from "lodash";
import React from "react";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import DecisionHistory from "./DecisionHistory";

const DecisionHistoryN = removeFragmentRefs(DecisionHistory);

it("renders correctly", () => {
  const props: PropTypesOf<typeof DecisionHistoryN> = {
    actions: [{ id: "1" }, { id: "2" }, { id: "3" }],
    onLoadMore: noop,
    hasMore: false,
    disableLoadMore: false,
  };
  const wrapper = shallow(<DecisionHistoryN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders empty state", () => {
  const props: PropTypesOf<typeof DecisionHistoryN> = {
    actions: [],
    onLoadMore: noop,
    hasMore: false,
    disableLoadMore: false,
  };
  const wrapper = shallow(<DecisionHistoryN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders hasMore", () => {
  const props: PropTypesOf<typeof DecisionHistoryN> = {
    actions: [{ id: "1" }, { id: "2" }, { id: "3" }],
    onLoadMore: noop,
    hasMore: true,
    disableLoadMore: false,
  };
  const wrapper = shallow(<DecisionHistoryN {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it("renders disable load more", () => {
  const props: PropTypesOf<typeof DecisionHistoryN> = {
    actions: [{ id: "1" }, { id: "2" }, { id: "3" }],
    onLoadMore: noop,
    hasMore: true,
    disableLoadMore: true,
  };
  const wrapper = shallow(<DecisionHistoryN {...props} />);
  expect(wrapper).toMatchSnapshot();
});
