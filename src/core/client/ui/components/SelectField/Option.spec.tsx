import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import Option from "./Option";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Option> = {
    disabled: false,
    hidden: false,
    value: "apple",
    children: "Apple",
  };
  const renderer = TestRenderer.create(<Option {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
