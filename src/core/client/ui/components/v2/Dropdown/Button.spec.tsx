import { noop } from "lodash";
import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Button from "./Button";

it("renders anchor button", () => {
  const props: PropTypesOf<typeof Button> = {
    href: "/moderate",
    children: "link",
    onClick: noop,
    className: "custom",
    target: "_blank",
  };
  const renderer = createRenderer();
  renderer.render(<Button {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders button", () => {
  const props: PropTypesOf<typeof Button> = {
    children: "link",
    onClick: noop,
    className: "custom",
    blankAdornment: true,
  };
  const renderer = createRenderer();
  renderer.render(<Button {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
