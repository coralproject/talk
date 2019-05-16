import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Subtitle from "./Subtitle";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Subtitle> = {
    children: "Hello World",
  };
  const renderer = createRenderer();
  renderer.render(<Subtitle {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
