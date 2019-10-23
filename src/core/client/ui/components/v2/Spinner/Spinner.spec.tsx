import React from "react";
import TestRenderer from "react-test-renderer";

import Spinner from "../Spinner";

it("renders correctly", () => {
  const renderer = TestRenderer.create(<Spinner />);
  expect(renderer.toJSON()).toMatchSnapshot();
});
