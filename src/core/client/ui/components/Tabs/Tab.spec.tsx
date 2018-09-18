import React from "react";
import TestRenderer from "react-test-renderer";

import Tab from "./Tab";

it("renders correctly", () => {
  const renderer = TestRenderer.create(<Tab tabId="three">Three</Tab>);
  expect(renderer.toJSON()).toMatchSnapshot();
});
