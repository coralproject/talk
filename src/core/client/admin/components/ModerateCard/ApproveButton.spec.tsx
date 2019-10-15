import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import ApproveButton from "./ApproveButton";

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
