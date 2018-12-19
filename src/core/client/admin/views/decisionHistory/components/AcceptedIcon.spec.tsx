import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import AcceptedIcon from "./AcceptedIcon";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<AcceptedIcon />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
