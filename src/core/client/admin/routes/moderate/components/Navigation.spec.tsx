import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import Navigation from "./Navigation";

import { PropTypesOf } from "coral-framework/types";
it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<Navigation />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders correctly with counts", () => {
  const props: PropTypesOf<typeof Navigation> = {
    unmoderatedCount: 3,
    reportedCount: 4,
    pendingCount: 0,
  };
  const renderer = createRenderer();
  renderer.render(<Navigation {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
