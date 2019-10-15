import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import RejectButton from "./RejectButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof RejectButton> = {
    invert: false,
  };
  const renderer = createRenderer();
  renderer.render(<RejectButton {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders correctly inverted", () => {
  const props: PropTypesOf<typeof RejectButton> = {
    invert: true,
  };
  const renderer = createRenderer();
  renderer.render(<RejectButton {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
