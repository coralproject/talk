import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Title from "./Title";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Title> = {
    children: "Hello World",
  };
  const renderer = createRenderer();
  renderer.render(<Title {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
