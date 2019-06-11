import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import RejectedIcon from "./RejectedIcon";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<RejectedIcon />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
