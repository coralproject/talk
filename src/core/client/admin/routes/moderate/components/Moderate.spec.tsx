import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import Moderate from "./Moderate";

import { PropTypesOf } from "talk-framework/types";
it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<Moderate />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders correctly with counts", () => {
  const props: PropTypesOf<typeof Moderate> = {
    unmoderatedCount: 3,
    reportedCount: 4,
    pendingCount: 0,
  };
  const renderer = createRenderer();
  renderer.render(<Moderate {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
