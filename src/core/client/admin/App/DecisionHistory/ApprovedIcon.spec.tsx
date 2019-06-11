import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import ApprovedIcon from "./ApprovedIcon";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<ApprovedIcon />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
