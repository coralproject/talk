import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import Title from "./Title";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<Title />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
