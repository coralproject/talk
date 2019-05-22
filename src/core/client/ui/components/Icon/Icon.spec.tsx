import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-framework/types";

import Icon from "./Icon";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Icon> = {
    children: "face",
  };
  const renderer = TestRenderer.create(<Icon {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});

it("renders correctly with specified size", () => {
  const props: PropTypesOf<typeof Icon> = {
    size: "lg",
    children: "bookmark",
  };
  const renderer = TestRenderer.create(<Icon {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
