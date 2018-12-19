import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import Empty from "./Empty";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<Empty />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
