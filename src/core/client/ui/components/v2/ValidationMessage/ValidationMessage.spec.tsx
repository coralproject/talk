import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import ValidationMessage from "./ValidationMessage";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ValidationMessage> = {
    className: "custom",
    children: "Hello World",
  };
  const renderer = TestRenderer.create(<ValidationMessage {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
