import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "talk-ui/types";

import ValidationMessage from "./ValidationMessage";

it("renders correctly", () => {
  const props: PropTypesOf<typeof ValidationMessage> = {
    className: "custom",
    color: "error",
    children: "Hello World",
  };
  const renderer = TestRenderer.create(<ValidationMessage {...props} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
