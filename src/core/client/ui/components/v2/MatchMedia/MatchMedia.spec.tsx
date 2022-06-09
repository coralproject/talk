import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-ui/types";

import { default as MatchMedia } from "./MatchMedia";

it("renders correctly", () => {
  const props: PropTypesOf<typeof MatchMedia> = {
    lteWidth: "xs",
    gteWidth: "sm",
    component: "div",
    screen: true,
    children: <div>Hello World</div>,
  };
  const renderer = createRenderer();
  renderer.render(<MatchMedia {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders less than and great than correctly", () => {
  const props: PropTypesOf<typeof MatchMedia> = {
    ltWidth: "xs",
    gtWidth: "sm",
    children: <div>Hello World</div>,
  };
  const renderer = createRenderer();
  renderer.render(<MatchMedia {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("map new speech prop to older aural prop", () => {
  const props: PropTypesOf<typeof MatchMedia> = {
    speech: true,
    children: <div>Hello World</div>,
  };
  const renderer = createRenderer();
  renderer.render(<MatchMedia {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
