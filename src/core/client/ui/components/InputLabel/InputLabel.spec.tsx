import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import InputLabel from "./InputLabel";

it("renders correctly", () => {
  const props: PropTypesOf<typeof InputLabel> = {
    className: "custom",
  };
  const renderer = TestRenderer.create(
    <InputLabel {...props}>Hello</InputLabel>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});
