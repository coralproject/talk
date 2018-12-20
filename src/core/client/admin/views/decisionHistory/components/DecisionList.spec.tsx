import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import DecisionList from "./DecisionList";

it("renders correctly", () => {
  const props: PropTypesOf<typeof DecisionList> = {
    children: "children",
  };
  const renderer = createRenderer();
  renderer.render(<DecisionList {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
