import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import Stories from "./Stories";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<Stories />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
