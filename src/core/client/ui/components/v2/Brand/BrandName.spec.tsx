import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import BrandName from "./BrandName";

it("renders correctly", () => {
  const props: PropTypesOf<typeof BrandName> = {
    align: "center",
    className: "custom",
    size: "lg",
  };
  const renderer = createRenderer();
  renderer.render(<BrandName {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
