import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import DecisionItem from "./DecisionItem";

it("renders correctly", () => {
  const props: PropTypesOf<typeof DecisionItem> = {
    icon: "icon",
    children: "children",
  };
  const renderer = createRenderer();
  renderer.render(<DecisionItem {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
