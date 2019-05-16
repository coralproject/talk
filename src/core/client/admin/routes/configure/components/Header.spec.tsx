import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Header from "./Header";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Header> = {
    children: "child",
  };
  const renderer = createRenderer();
  renderer.render(<Header {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
