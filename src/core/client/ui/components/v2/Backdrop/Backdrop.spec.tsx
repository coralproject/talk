import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import Backdrop from "./Backdrop";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<Backdrop />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders correctly when active", () => {
  const renderer = createRenderer();
  renderer.render(<Backdrop active />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
