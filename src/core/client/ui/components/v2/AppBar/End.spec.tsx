import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import End from "./End";

it("renders correctly", () => {
  const props: PropTypesOf<typeof End> = {
    children: "children",
    className: "custom",
    itemGutter: true,
  };
  const renderer = createRenderer();
  renderer.render(<End {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
