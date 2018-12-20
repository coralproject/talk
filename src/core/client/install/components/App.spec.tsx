import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import App from "./App";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<App />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
