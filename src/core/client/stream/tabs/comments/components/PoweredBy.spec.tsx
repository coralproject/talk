import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import PoweredBy from "./PoweredBy";

it("renders correctly", () => {
  const props: PropTypesOf<typeof PoweredBy> = {
    className: "custom",
  };
  const renderer = createRenderer();
  renderer.render(<PoweredBy {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
