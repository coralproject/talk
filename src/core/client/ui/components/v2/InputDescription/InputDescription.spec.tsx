import React from "react";
import TestRenderer from "react-test-renderer";

import InputDescription from "../InputDescription";

it("renders correctly", () => {
  const renderer = TestRenderer.create(
    <InputDescription>Form Components should go here</InputDescription>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});
