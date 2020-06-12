import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import Navigation from "./Navigation";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<Navigation showConfigure showDashboard={true} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
