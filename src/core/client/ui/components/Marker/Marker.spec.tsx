import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "talk-ui/types";

import Marker from "./Marker";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Marker> = {
    className: "custom",
    color: "error",
    variant: "filled",
    children: "Spam",
  };
  const renderer = TestRenderer.create(<Marker {...props}>Hello</Marker>);
  expect(renderer.toJSON()).toMatchSnapshot();
});
