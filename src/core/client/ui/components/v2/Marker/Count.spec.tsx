import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import Count from "./Count";

it("renders correctly", () => {
  const props: PropTypesOf<typeof Count> = {
    className: "custom",
    children: "30",
  };
  const renderer = TestRenderer.create(<Count {...props}>Hello</Count>);
  expect(renderer.toJSON()).toMatchSnapshot();
});
