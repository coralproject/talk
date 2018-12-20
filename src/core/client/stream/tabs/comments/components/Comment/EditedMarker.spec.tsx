import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import EditedMarker from "./EditedMarker";

it("renders correctly", () => {
  const renderer = createRenderer();
  renderer.render(<EditedMarker />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
