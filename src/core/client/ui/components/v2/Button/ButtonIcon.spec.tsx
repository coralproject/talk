import React from "react";
import ShallowRenderer from "react-test-renderer/shallow";

import { PropTypesOf } from "coral-framework/types";

import { ButtonIcon } from "./ButtonIcon";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ButtonIcon> = {
    classes: {
      root: "root",
    } as any,
    children: "Push me",
  };
  const renderer = ShallowRenderer.createRenderer();
  renderer.render(<ButtonIcon {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

it("forwards ref", () => {
  const props: PropTypesOf<typeof ButtonIcon> = {
    // eslint-disable-next-line:no-empty
    forwardRef: () => {},
    classes: {} as any,
    children: "Push me",
  };
  const renderer = ShallowRenderer.createRenderer();
  renderer.render(<ButtonIcon {...props} />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});
