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
    // tslint:disable-next-line:no-empty
    forwardRef: () => {},
    classes: {} as any,
    children: "Push me",
  };
  const renderer = ShallowRenderer.createRenderer();
  renderer.render(<Button {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders a regular sized, primary colored ghost button with fullWidth", () => {
  const props: PropTypesOf<typeof Button> = {
    color: "primary",
    variant: "ghost",
    fullWidth: true,
    classes: {
      colorPrimary: "colorPrimary",
      variantGhost: "variantGhost",
      sizeRegular: "sizeRegular",
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
