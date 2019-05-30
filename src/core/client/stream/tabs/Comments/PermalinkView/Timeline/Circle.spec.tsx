import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Circle from "./Circle";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Circle> = {
    className: "root",
    hollow: true,
    end: true,
  };
  const renderer = createRenderer();
  renderer.render(<Circle {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
