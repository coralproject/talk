import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import RejectButton from "./RejectButton";

import { PropTypesOf } from "talk-framework/types";

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
