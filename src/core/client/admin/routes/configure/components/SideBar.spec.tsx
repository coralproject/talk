import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import SideBar from "./SideBar";

it("renders correctly", () => {
  const props: PropTypesOf<typeof SideBar> = {
    children: "child",
  };
  const renderer = createRenderer();
  renderer.render(<SideBar {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
