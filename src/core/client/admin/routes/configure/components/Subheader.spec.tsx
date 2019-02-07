import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import Subheader from "./Subheader";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Subheader> = {
    children: "child",
  };
  const renderer = createRenderer();
  renderer.render(<Subheader {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
