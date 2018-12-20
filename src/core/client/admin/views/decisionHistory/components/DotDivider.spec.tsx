import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import DotDivider from "./DotDivider";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<DotDivider />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
