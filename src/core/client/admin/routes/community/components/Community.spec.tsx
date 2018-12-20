import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import Community from "./Community";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<Community />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
