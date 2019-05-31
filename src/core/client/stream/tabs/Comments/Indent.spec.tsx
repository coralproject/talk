import React from "react";
import { createRenderer } from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import Indent from "./Indent";

it("renders level0", () => {
  const props: PropTypesOf<typeof Indent> = {
    children: <div>Hello World</div>,
  };
  const renderer = createRenderer();
  renderer.render(<Indent {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders level1", () => {
  const props: PropTypesOf<typeof Indent> = {
    level: 1,
    children: <div>Hello World</div>,
  };
  const renderer = createRenderer();
  renderer.render(<Indent {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("renders without border", () => {
  const props: PropTypesOf<typeof Indent> = {
    level: 1,
    noBorder: true,
    children: <div>Hello World</div>,
  };
  const renderer = createRenderer();
  renderer.render(<Indent {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
