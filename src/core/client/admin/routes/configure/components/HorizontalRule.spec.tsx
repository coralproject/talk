import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import HorizontalRule from "./HorizontalRule";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<HorizontalRule />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
