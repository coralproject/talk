import React from "react";
import TestRenderer from "react-test-renderer";

import UIContext, { UIContextProps } from "../UIContext";
import Tab from "./Tab";
import TabBar from "./TabBar";

it("renders correctly", () => {
  const context: UIContextProps = {
    renderWindow: window,
  };
  const testRenderer = TestRenderer.create(
    <UIContext.Provider value={context}>
      <TabBar activeTab="one">
        <Tab tabID="one">One</Tab>
        <Tab tabID="two">Two</Tab>
        <Tab tabID="three">Three</Tab>
      </TabBar>
    </UIContext.Provider>
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("sets initial tab as active", () => {
  const context: UIContextProps = {
    renderWindow: window,
  };
  const renderer = TestRenderer.create(
    <UIContext.Provider value={context}>
      <TabBar activeTab="one">
        <Tab tabID="one">One</Tab>
        <Tab tabID="two">Two</Tab>
        <Tab tabID="three">Three</Tab>
      </TabBar>
    </UIContext.Provider>
  );
  expect(renderer.toJSON()).toMatchSnapshot();

  const testInstance = renderer.root;
  expect(testInstance.findByType(TabBar).props.activeTab).toBe("one");
  const tabs = testInstance.findAllByType(Tab);
  expect(tabs.length).toBe(3);
  expect(tabs[0].props.active).toBe(true);
  expect(tabs[1].props.active).toBe(false);
  expect(tabs[2].props.active).toBe(false);
});
