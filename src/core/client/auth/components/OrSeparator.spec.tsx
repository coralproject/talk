import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import OrSeparator from "./OrSeparator";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<OrSeparator />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
