import React from "react";
import TestRenderer from "react-test-renderer";

import TabContent from "./TabContent";
import TabPane from "./TabPane";

it("renders correctly", () => {
  const renderer = TestRenderer.create(
    <TabContent activeTab="one">
      <TabPane tabId="one">Hola One</TabPane>
      <TabPane tabId="two">Hola Two</TabPane>
      <TabPane tabId="three">Hola Three</TabPane>
    </TabContent>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it("sets initial tab as active, renders only one", () => {
  const renderer = TestRenderer.create(
    <TabContent activeTab="one">
      <TabPane tabId="one">Hola One</TabPane>
      <TabPane tabId="two">Hola Two</TabPane>
      <TabPane tabId="three">Hola Three</TabPane>
    </TabContent>
  );

  const testInstance = renderer.root;
  expect(testInstance.findByType(TabContent).props.activeTab).toBe("one");
  const panes = testInstance.findAllByType(TabPane);
  expect(panes.length).toBe(1);
});
