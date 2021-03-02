import React from "react";
import TestRenderer from "react-test-renderer";

import { PropTypesOf } from "coral-ui/types";

import UIContext, { UIContextProps } from "../UIContext";
import CheckBox from "./CheckBox";

it("renders correctly", () => {
  const props: PropTypesOf<typeof CheckBox> = {
    className: "custom",
    id: "checkboxID",
    checked: true,
    children: "Yes I agree",
  };
  const context: UIContextProps = {
    renderWindow: window,
  };
  const testRenderer = TestRenderer.create(
    <UIContext.Provider value={context}>
      {<CheckBox {...props} />}
    </UIContext.Provider>
  );
  expect(testRenderer.toJSON()).toMatchSnapshot();
});
