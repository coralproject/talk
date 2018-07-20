import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "talk-framework/types";

import BaseButton from "./BaseButton";

it("renders correctly", () => {
  const props: PropTypesOf<typeof BaseButton> = {
    className: "my-class",
    children: "Push Me",
  };
  const renderer = TestRenderer.create(<BaseButton {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});

it("renders as anchor", () => {
  const props: PropTypesOf<typeof BaseButton> = {
    anchor: true,
    children: "Push Me",
  };
  const renderer = TestRenderer.create(<BaseButton {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
