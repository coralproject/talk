import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import AcceptButton from "./AcceptButton";

import { PropTypesOf } from "talk-framework/types";

it("renders correctly", () => {
  const props: PropTypesOf<typeof AcceptButton> = {
    invert: false,
  };
  const renderer = createRenderer();
  renderer.render(<AcceptButton {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders correctly inverted", () => {
  const props: PropTypesOf<typeof AcceptButton> = {
    invert: true,
  };
  const renderer = createRenderer();
  renderer.render(<AcceptButton {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
