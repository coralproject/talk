import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-framework/types";

import UIContext, { UIContextProps } from "../UIContext";
import BaseButton from "./BaseButton";

it("renders correctly", () => {
  const context: UIContextProps = {
    renderWindow: window,
  };
  const props: PropTypesOf<typeof BaseButton> = {
    className: "my-class",
    children: "Push Me",
  };
  const testRenderer = TestRenderer.create(
    <UIContext.Provider value={context}>
      {<BaseButton {...props} />}
    </UIContext.Provider>
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});

it("renders as anchor", () => {
  const context: UIContextProps = {
    renderWindow: window,
  };
  const props: PropTypesOf<typeof BaseButton> = {
    anchor: true,
    children: "Push Me",
  };
  const testRenderer = TestRenderer.create(
    <UIContext.Provider value={context}>
      {<BaseButton {...props} />}
    </UIContext.Provider>
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
