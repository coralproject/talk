import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import Login from "./Login";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<Login />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
