import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "talk-framework/testHelpers";
import { PropTypesOf } from "talk-framework/types";

import DecisionHistory from "./DecisionHistory";

const DecisionHistoryN = removeFragmentRefs(DecisionHistory);

const baseProps: PropTypesOf<typeof DecisionHistoryN> = {
  actions: [],
  onLoadMore: noop,
  hasMore: false,
  disableLoadMore: false,
  onClosePopover: noop,
};

it("renders correctly", () => {
  const props: PropTypesOf<typeof DecisionHistoryN> = {
    ...baseProps,
    actions: [{ id: "1" }, { id: "2" }, { id: "3" }],
  };
  const renderer = createRenderer();
  renderer.render(<DecisionHistoryN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders empty state", () => {
  const props: PropTypesOf<typeof DecisionHistoryN> = {
    ...baseProps,
  };
  const renderer = createRenderer();
  renderer.render(<DecisionHistoryN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders hasMore", () => {
  const props: PropTypesOf<typeof DecisionHistoryN> = {
    ...baseProps,
    actions: [{ id: "1" }, { id: "2" }, { id: "3" }],
    hasMore: true,
  };
  const renderer = createRenderer();
  renderer.render(<DecisionHistoryN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders disable load more", () => {
  const props: PropTypesOf<typeof DecisionHistoryN> = {
    ...baseProps,
    actions: [{ id: "1" }, { id: "2" }, { id: "3" }],
    hasMore: true,
    disableLoadMore: true,
  };
  const renderer = createRenderer();
  renderer.render(<DecisionHistoryN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
