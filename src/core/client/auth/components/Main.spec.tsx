import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Main from "./Main";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Main> = {
    children: "Hello World",
  };
  const renderer = createRenderer();
  renderer.render(<Main {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
