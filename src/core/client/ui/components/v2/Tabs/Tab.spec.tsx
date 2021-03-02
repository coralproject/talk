import React from "react";
import TestRenderer from "react-test-renderer";

import UIContext, { UIContextProps } from "../UIContext";
import Tab from "./Tab";

it("renders correctly", () => {
  const context: UIContextProps = {
    renderWindow: window,
  };
  const testRenderer = TestRenderer.create(
    <UIContext.Provider value={context}>
      {<Tab tabID="three">Three</Tab>}
    </UIContext.Provider>
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
