import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import HorizontalGutter from "./HorizontalGutter";

it("renders correctly", () => {
  const props: PropTypesOf<typeof HorizontalGutter> = {
    className: "custom",
  };
  const renderer = TestRenderer.create(<HorizontalGutter {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});

it("renders double size", () => {
  const props: PropTypesOf<typeof HorizontalGutter> = {
    size: "double",
  };
  const renderer = TestRenderer.create(<HorizontalGutter {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
