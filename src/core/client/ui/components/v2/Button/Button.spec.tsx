import React from "react";
import ShallowRenderer from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import { Button } from "./Button";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Button> = {
    classes: {
      mouseHover: "mouseHover",
      keyboardFocus: "keyboardFocus",
    } as any,
    children: "Push me",
  };
  const renderer = ShallowRenderer.createRenderer();
  renderer.render(<Button {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("forwards ref", () => {
  const props: PropTypesOf<typeof Button> = {
    // eslint-disable-next-line:no-empty
    forwardRef: () => {},
    classes: {} as any,
    children: "Push me",
  };
  const renderer = ShallowRenderer.createRenderer();
  renderer.render(<Button {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders a medium sized, alert colored filled button with fullWidth", () => {
  const props: PropTypesOf<typeof Button> = {
    color: "alert",
    variant: "regular",
    fullWidth: true,
    classes: {
      colorAlert: "colorAlert",
      variantFilled: "variantFilled",
      sizeMedium: "sizeMedium",
      fullWidth: "fullWidth",
    } as any,
    children: "Push me",
  };
  const renderer = ShallowRenderer.createRenderer();
  renderer.render(<Button {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders active state", () => {
  const props: PropTypesOf<typeof Button> = {
    active: true,
    classes: {
      active: "active",
    } as any,
    children: "Push me",
  };
  const renderer = ShallowRenderer.createRenderer();
  renderer.render(<Button {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
