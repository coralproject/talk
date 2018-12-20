import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import AppBar from "./AppBar";

it("renders correctly", () => {
  const props: PropTypesOf<typeof AppBar> = {
    children: "child",
    gutterBegin: true,
    gutterEnd: true,
    className: "custom",
  };
  const renderer = createRenderer();
  renderer.render(<AppBar {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
