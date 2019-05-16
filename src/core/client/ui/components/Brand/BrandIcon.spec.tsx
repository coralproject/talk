import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import BrandIcon from "./BrandIcon";

it("renders correctly", () => {
  const props: PropTypesOf<typeof BrandIcon> = {
    className: "custom",
    size: "lg",
  };
  const renderer = createRenderer();
  renderer.render(<BrandIcon {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
