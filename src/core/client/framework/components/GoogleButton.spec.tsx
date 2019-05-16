import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import GoogleButton from "./GoogleButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof GoogleButton> = {
    onClick: noop,
    children: "Login with Google",
  };
  const renderer = createRenderer();
  renderer.render(<GoogleButton {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
