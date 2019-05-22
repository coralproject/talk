import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import ShowMoreButton from "./ShowMoreButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ShowMoreButton> = {
    disabled: false,
    onClick: noop,
  };
  const renderer = createRenderer();
  renderer.render(<ShowMoreButton {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
