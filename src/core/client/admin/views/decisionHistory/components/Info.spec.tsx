import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "talk-framework/types";

import Info from "./Info";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Info> = {
    children: "children",
  };
  const renderer = createRenderer();
  renderer.render(<Info {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
