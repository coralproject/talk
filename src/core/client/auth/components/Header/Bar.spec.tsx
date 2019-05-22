import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Bar from "./Bar";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Bar> = {
    children: "Hello World",
  };
  const renderer = createRenderer();
  renderer.render(<Bar {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
