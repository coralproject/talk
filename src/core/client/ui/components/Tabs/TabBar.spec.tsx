import React from "react";
import TestRenderer from "react-test-renderer";

import Tab from "./Tab";
import TabBar from "./TabBar";

it("renders correctly", () => {
  const renderer = TestRenderer.create(
    <TabBar activeTab="one">
      <Tab tabID="one">One</Tab>
      <Tab tabID="two">Two</Tab>
      <Tab tabID="three">Three</Tab>
    </TabBar>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it("sets initial tab as active", () => {
  const renderer = TestRenderer.create(
    <TabBar activeTab="one">
      <Tab tabID="one">One</Tab>
      <Tab tabID="two">Two</Tab>
      <Tab tabID="three">Three</Tab>
    </TabBar>
  );

  const testInstance = renderer.root;
  expect(testInstance.findByType(TabBar).props.activeTab).toBe("one");
  const tabs = testInstance.findAllByType(Tab);
  expect(tabs.length).toBe(3);
  expect(tabs[0].props.active).toBe(true);
  expect(tabs[1].props.active).toBe(false);
  expect(tabs[2].props.active).toBe(false);
});
