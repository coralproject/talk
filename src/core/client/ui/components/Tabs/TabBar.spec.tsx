import React from "react";
import TestRenderer from "react-test-renderer";

import Tab from "./Tab";
import TabBar from "./TabBar";

it("renders correctly", () => {
  const renderer = TestRenderer.create(
    <TabBar activeTab="one">
      <Tab tabId="one">One</Tab>
      <Tab tabId="two">Two</Tab>
      <Tab tabId="three">Three</Tab>
    </TabBar>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});
