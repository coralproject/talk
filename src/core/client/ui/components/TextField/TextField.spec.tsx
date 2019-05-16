import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import TextField from "./TextField";

it("renders correctly", () => {
  const props: PropTypesOf<typeof TextField> = {
    className: "custom",
    defaultValue: "Hello World",
    adornment: "Unit",
  };
  const renderer = TestRenderer.create(<TextField {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
