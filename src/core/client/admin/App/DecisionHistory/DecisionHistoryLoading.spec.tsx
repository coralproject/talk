import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import DecisionHistoryLoading from "./DecisionHistoryLoading";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<DecisionHistoryLoading />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
