import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Navigation from "./Navigation";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Navigation> = {
    children: "children",
  };
  const renderer = createRenderer();
  renderer.render(<Navigation {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
