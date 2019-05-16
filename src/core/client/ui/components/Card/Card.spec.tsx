import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import Card from "./Card";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Card> = {
    className: "custom",
    children: "Hello World",
  };
  const renderer = TestRenderer.create(<Card {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
