import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import Typography from "./Typography";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Typography> = {
    className: "custom",
    variant: "heading1",
    color: "textSecondary",
    gutterBottom: true,
    children: "Hello World",
    noWrap: true,
    align: "left",
  };
  const renderer = TestRenderer.create(<Typography {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
