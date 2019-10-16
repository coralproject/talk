import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import Counter from "./Counter";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<Counter>20</Counter>);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
