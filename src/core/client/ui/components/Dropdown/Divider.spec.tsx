import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import Divider from "./Divider";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<Divider />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
