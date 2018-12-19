import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import ButtonsBar from "./ButtonsBar";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ButtonsBar> = {
    children: "children",
  };
  const renderer = createRenderer();
  renderer.render(<ButtonsBar {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
