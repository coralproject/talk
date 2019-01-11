import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import HorizontalSeparator from "./HorizontalSeparator";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<HorizontalSeparator>Or</HorizontalSeparator>);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
