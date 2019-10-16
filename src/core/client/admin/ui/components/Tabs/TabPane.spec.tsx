import React from "react";
import TestRenderer from "react-test-renderer";

import TabPane from "./TabPane";

it("renders correctly", () => {
  const renderer = TestRenderer.create(<TabPane tabID="three">Three</TabPane>);
  expect(renderer.toJSON()).toMatchSnapshot();
});
