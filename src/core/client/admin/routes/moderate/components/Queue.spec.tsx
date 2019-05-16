import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { removeFragmentRefs } from "coral-framework/testHelpers";
import { PropTypesOf } from "coral-framework/types";

import Queue from "./Queue";

const QueueN = removeFragmentRefs(Queue);

it("renders correctly with load more", () => {
  const props: PropTypesOf<typeof QueueN> = {
    comments: [],
    settings: {},
    onLoadMore: noop,
    hasMore: true,
    disableLoadMore: false,
    danglingLogic: () => true,
  };
  const renderer = createRenderer();
  renderer.render(<QueueN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders correctly without load more", () => {
  const props: PropTypesOf<typeof QueueN> = {
    comments: [],
    settings: {},
    onLoadMore: noop,
    hasMore: false,
    disableLoadMore: false,
    danglingLogic: () => true,
  };
  const renderer = createRenderer();
  renderer.render(<QueueN {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
