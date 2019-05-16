import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import CallOut from "./CallOut";

it("renders correctly", () => {
  const props: PropTypesOf<typeof CallOut> = {
    className: "custom",
    color: "error",
    children: "Hello World",
  };
  const renderer = TestRenderer.create(<CallOut {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
