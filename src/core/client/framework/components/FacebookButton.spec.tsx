import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import FacebookButton from "./FacebookButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof FacebookButton> = {
    onClick: noop,
    children: "Login with Facebook",
  };
  const renderer = createRenderer();
  renderer.render(<FacebookButton {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
