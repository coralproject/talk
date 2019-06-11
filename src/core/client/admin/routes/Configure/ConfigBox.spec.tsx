import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import ConfigBox from "./ConfigBox";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ConfigBox> = {
    topRight: <span>topRight</span>,
    title: <span>title</span>,
    children: "child",
  };
  const renderer = createRenderer();
  renderer.render(<ConfigBox {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
