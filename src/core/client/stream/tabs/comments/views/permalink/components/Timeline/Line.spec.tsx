import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Line from "./Line";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Line> = {
    className: "root",
    dotted: true,
  };
  const renderer = createRenderer();
  renderer.render(<Line {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
