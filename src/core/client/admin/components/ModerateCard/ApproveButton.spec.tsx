import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import ApproveButton from "./ApproveButton";

import { PropTypesOf } from "coral-framework/types";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ApproveButton> = {
    invert: false,
  };
  const renderer = createRenderer();
  renderer.render(<ApproveButton {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders correctly inverted", () => {
  const props: PropTypesOf<typeof ApproveButton> = {
    invert: true,
  };
  const renderer = createRenderer();
  renderer.render(<ApproveButton {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
